function [eUI, P, Q, e] = mftest(UI)
    
    % iterations -- steps=5000, 
    % learnning rate -- gamma=0.0002, 
    % regularization rate -- lambda=0.02
    % by default
    steps=200;
    gamma=0.0002; 
    lambda=0.02;
    % validRindex = ~isnan(UI);
    % validRindex = (oriRatings > 0);
    % numFt: latent features of U-I matrix
    % %%%%%%% how to get the number of feature: numFt? Cross-validation
        % Can use SVD,PCA,PMF to get the number of latent features
        % use SVD in this program
    NaNindex = isnan(UI);
    UI(NaNindex) = 0;  
    % get the latent features of UI
    singularVal = svd(UI);      
    numFt = sum(singularVal > 1.0e-3)
    
    %numFt = 10;% for 100k movieLens data
    
    [numRow, numCol] = size(UI);
    P = rand(numRow, numFt);
    Q = rand(numCol, numFt);
    Q = Q';
    size(Q);
    size(P);
    for step = 1:steps
        for i = 1:numRow
            for j = 1:numCol
                if (UI(i, j) > 0)
                    eij = UI(i, j) - P(i,:) * Q(:,j);
                    for f = 1:numFt 
                        P(i, f) = P(i, f) + gamma * (2 * eij * Q(f, j) - lambda * P(i, f));
                        Q(f, j) = Q(f, j) + gamma * (2 * eij * P(i, f) - lambda * Q(f, j));
                    end
                end
            end
        end
        
        eUI = P * Q;
        e = 0;
        
        for i = 1 : numRow
            for j = 1 : numCol
                if (UI(i, j) > 0)
                    e = e + (UI(i, j) - P(i, :) * Q(:, j))^2;
                    for f = 1:numFt
                        e = e + lambda/2 * (P(i, f)^2 + Q(f, j)^2);
                    end
                end
            end
        end
        
        fprintf("\t%d out of %d steps\n\tprediction error = %f\n", step, steps, e);
    end

    Q = Q';