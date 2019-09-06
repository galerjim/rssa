import sys
import os

os.chdir(os.getcwd())
f= open("%s.txt"%(sys.argv[1]), "w+")
f.write("test")
f.close()