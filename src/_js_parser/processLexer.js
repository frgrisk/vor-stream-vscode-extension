// Generated from /home/kng/repo/vor-stream/cmd/process/process.g4 by ANTLR 4.12.0
// jshint ignore: start
import antlr4 from 'antlr4';

import isSQLStmt from './processParser.js';


const serializedATN = [4,0,99,973,6,-1,2,0,7,0,2,1,7,1,2,2,7,2,2,3,7,3,2,
4,7,4,2,5,7,5,2,6,7,6,2,7,7,7,2,8,7,8,2,9,7,9,2,10,7,10,2,11,7,11,2,12,7,
12,2,13,7,13,2,14,7,14,2,15,7,15,2,16,7,16,2,17,7,17,2,18,7,18,2,19,7,19,
2,20,7,20,2,21,7,21,2,22,7,22,2,23,7,23,2,24,7,24,2,25,7,25,2,26,7,26,2,
27,7,27,2,28,7,28,2,29,7,29,2,30,7,30,2,31,7,31,2,32,7,32,2,33,7,33,2,34,
7,34,2,35,7,35,2,36,7,36,2,37,7,37,2,38,7,38,2,39,7,39,2,40,7,40,2,41,7,
41,2,42,7,42,2,43,7,43,2,44,7,44,2,45,7,45,2,46,7,46,2,47,7,47,2,48,7,48,
2,49,7,49,2,50,7,50,2,51,7,51,2,52,7,52,2,53,7,53,2,54,7,54,2,55,7,55,2,
56,7,56,2,57,7,57,2,58,7,58,2,59,7,59,2,60,7,60,2,61,7,61,2,62,7,62,2,63,
7,63,2,64,7,64,2,65,7,65,2,66,7,66,2,67,7,67,2,68,7,68,2,69,7,69,2,70,7,
70,2,71,7,71,2,72,7,72,2,73,7,73,2,74,7,74,2,75,7,75,2,76,7,76,2,77,7,77,
2,78,7,78,2,79,7,79,2,80,7,80,2,81,7,81,2,82,7,82,2,83,7,83,2,84,7,84,2,
85,7,85,2,86,7,86,2,87,7,87,2,88,7,88,2,89,7,89,2,90,7,90,2,91,7,91,2,92,
7,92,2,93,7,93,2,94,7,94,2,95,7,95,2,96,7,96,2,97,7,97,2,98,7,98,2,99,7,
99,2,100,7,100,2,101,7,101,2,102,7,102,2,103,7,103,2,104,7,104,2,105,7,105,
2,106,7,106,2,107,7,107,2,108,7,108,2,109,7,109,2,110,7,110,2,111,7,111,
2,112,7,112,2,113,7,113,2,114,7,114,2,115,7,115,2,116,7,116,2,117,7,117,
2,118,7,118,2,119,7,119,2,120,7,120,2,121,7,121,2,122,7,122,2,123,7,123,
2,124,7,124,2,125,7,125,2,126,7,126,2,127,7,127,2,128,7,128,2,129,7,129,
2,130,7,130,2,131,7,131,1,0,1,0,1,1,1,1,1,2,1,2,1,2,1,2,1,2,1,3,1,3,1,3,
1,4,1,4,1,4,1,4,1,4,1,4,1,4,1,4,1,4,1,4,1,5,1,5,1,6,1,6,1,6,1,6,1,6,1,6,
1,7,1,7,1,8,1,8,1,8,1,8,1,9,1,9,1,10,1,10,1,10,1,11,1,11,1,12,1,12,1,12,
1,12,1,13,1,13,1,13,1,13,1,14,1,14,1,14,1,14,1,14,1,15,1,15,1,15,1,15,1,
15,1,16,1,16,1,16,1,16,1,17,1,17,1,17,1,17,1,18,1,18,1,18,1,18,1,19,1,19,
1,19,1,19,1,20,1,20,1,20,1,20,1,21,1,21,1,21,1,21,1,22,1,22,1,23,1,23,1,
24,1,24,1,25,1,25,1,25,5,25,360,8,25,10,25,12,25,363,9,25,1,25,1,25,1,25,
1,26,3,26,369,8,26,1,26,1,26,1,26,4,26,374,8,26,11,26,12,26,375,3,26,378,
8,26,1,26,3,26,381,8,26,1,27,1,27,1,27,1,27,5,27,387,8,27,10,27,12,27,390,
9,27,1,27,1,27,1,27,1,27,5,27,396,8,27,10,27,12,27,399,9,27,1,27,3,27,402,
8,27,1,28,1,28,1,29,1,29,1,29,1,29,1,29,1,29,1,29,1,29,1,29,1,29,1,29,1,
29,1,29,1,29,1,29,1,29,1,29,1,29,1,30,1,30,1,30,1,30,1,30,1,30,1,30,1,30,
1,30,1,31,1,31,1,31,1,31,1,32,1,32,1,32,1,33,1,33,1,33,1,33,1,33,1,33,1,
33,1,33,1,34,1,34,1,34,1,34,1,34,1,34,1,35,1,35,1,35,1,35,1,35,1,35,1,36,
1,36,1,36,1,36,1,37,1,37,1,37,1,37,1,37,1,37,1,37,1,37,1,37,1,37,1,38,1,
38,1,38,1,38,1,38,1,38,1,39,1,39,1,39,1,39,1,39,1,39,1,39,1,39,1,39,1,39,
1,39,1,39,1,39,1,39,1,40,1,40,1,40,1,40,1,40,1,40,1,40,1,40,1,40,1,40,1,
41,1,41,1,41,1,41,1,41,1,41,1,41,1,41,1,42,1,42,1,42,1,42,1,42,1,42,1,42,
1,43,1,43,1,43,1,43,1,43,1,43,1,43,1,44,1,44,1,44,1,45,1,45,1,45,1,46,1,
46,1,46,1,46,1,46,1,46,1,47,1,47,1,47,1,47,1,47,1,47,1,47,1,47,1,47,1,47,
1,47,1,48,1,48,1,48,1,49,1,49,1,49,1,49,1,49,1,50,1,50,1,50,1,50,1,50,1,
50,1,50,1,50,1,51,1,51,1,51,1,51,1,51,1,51,1,51,1,52,1,52,1,52,1,52,1,52,
1,52,1,52,1,52,1,52,1,53,1,53,1,53,1,53,1,53,1,53,1,54,1,54,1,54,1,54,1,
54,1,54,1,55,1,55,1,55,1,55,1,55,1,56,1,56,1,56,1,56,1,56,1,57,1,57,1,57,
1,57,1,57,1,57,1,58,1,58,1,58,1,59,1,59,1,59,1,59,1,59,1,59,1,59,1,59,1,
60,1,60,1,60,1,60,1,60,1,60,1,60,1,61,1,61,1,61,1,61,1,61,1,61,1,61,1,61,
1,62,1,62,1,62,1,62,1,63,1,63,1,63,1,63,1,63,1,63,1,63,1,64,1,64,1,64,1,
64,1,65,1,65,1,65,1,65,1,65,1,65,1,65,1,66,1,66,1,66,1,66,1,66,1,67,1,67,
1,67,1,68,1,68,1,68,1,68,1,69,1,69,1,69,1,69,1,69,1,69,1,69,1,69,1,70,1,
70,1,70,1,70,1,70,1,70,1,70,1,71,1,71,1,71,1,71,1,71,1,71,1,71,1,71,1,71,
1,71,1,71,1,72,1,72,1,72,1,72,1,72,1,72,1,72,1,73,1,73,1,73,1,73,1,73,1,
73,1,73,1,74,1,74,1,74,1,74,1,74,1,74,1,74,1,74,1,75,1,75,1,75,1,75,1,75,
1,75,1,75,1,76,1,76,1,76,1,76,1,76,1,77,1,77,1,77,1,77,1,77,1,78,1,78,1,
78,1,78,1,78,1,78,1,78,1,78,1,79,1,79,1,79,1,79,1,79,1,80,1,80,1,80,1,80,
1,80,1,81,1,81,1,81,1,82,1,82,1,82,1,82,1,83,1,83,1,83,1,83,1,83,1,83,1,
83,1,83,1,84,1,84,1,84,1,84,1,84,1,85,1,85,1,85,1,85,1,85,1,85,1,85,1,85,
1,85,1,85,1,85,1,85,1,86,1,86,1,86,1,86,1,86,1,86,1,86,1,86,1,86,1,86,1,
86,1,87,1,87,1,87,1,87,1,87,1,87,1,88,1,88,1,88,1,88,1,88,1,89,1,89,1,89,
1,89,1,89,1,89,1,89,1,90,1,90,1,90,1,90,1,90,1,90,1,90,1,90,1,91,1,91,1,
91,1,91,1,92,1,92,1,92,1,92,1,92,1,92,1,92,1,92,1,92,1,92,1,92,1,92,1,92,
1,92,1,92,1,93,1,93,5,93,842,8,93,10,93,12,93,845,9,93,1,94,1,94,1,94,1,
94,5,94,851,8,94,10,94,12,94,854,9,94,1,94,1,94,1,95,1,95,1,95,1,95,5,95,
862,8,95,10,95,12,95,865,9,95,1,95,1,95,1,95,3,95,870,8,95,1,95,1,95,1,96,
1,96,1,96,1,96,1,97,3,97,879,8,97,1,97,1,97,4,97,883,8,97,11,97,12,97,884,
1,98,1,98,1,99,1,99,1,100,1,100,1,101,1,101,1,102,1,102,1,103,1,103,1,104,
1,104,1,105,1,105,1,106,1,106,1,107,1,107,1,108,1,108,1,109,1,109,1,110,
1,110,1,111,1,111,1,112,1,112,1,113,1,113,1,114,1,114,1,115,1,115,1,116,
1,116,1,117,1,117,1,118,1,118,1,119,1,119,1,120,1,120,1,121,1,121,1,122,
1,122,1,123,1,123,1,124,1,124,1,125,1,125,1,126,1,126,1,126,3,126,946,8,
126,1,127,1,127,1,127,1,127,1,127,1,127,1,128,1,128,1,129,1,129,1,130,1,
130,1,130,5,130,961,8,130,10,130,12,130,964,9,130,3,130,966,8,130,1,131,
1,131,3,131,970,8,131,1,131,1,131,2,361,863,0,132,1,1,3,2,5,3,7,4,9,5,11,
6,13,7,15,8,17,9,19,10,21,11,23,12,25,13,27,14,29,15,31,16,33,17,35,18,37,
19,39,20,41,21,43,22,45,23,47,24,49,25,51,26,53,27,55,28,57,29,59,30,61,
31,63,32,65,33,67,34,69,35,71,36,73,37,75,38,77,39,79,40,81,41,83,42,85,
43,87,44,89,45,91,46,93,47,95,48,97,49,99,50,101,51,103,52,105,53,107,54,
109,55,111,56,113,57,115,58,117,59,119,60,121,61,123,62,125,63,127,64,129,
65,131,66,133,67,135,68,137,69,139,70,141,71,143,72,145,73,147,74,149,75,
151,76,153,77,155,78,157,79,159,80,161,81,163,82,165,83,167,84,169,85,171,
86,173,87,175,88,177,89,179,90,181,91,183,92,185,93,187,94,189,95,191,96,
193,97,195,98,197,99,199,0,201,0,203,0,205,0,207,0,209,0,211,0,213,0,215,
0,217,0,219,0,221,0,223,0,225,0,227,0,229,0,231,0,233,0,235,0,237,0,239,
0,241,0,243,0,245,0,247,0,249,0,251,0,253,0,255,0,257,0,259,0,261,0,263,
0,1,0,38,1,0,48,57,1,0,34,34,1,0,39,39,3,0,65,90,95,95,97,122,4,0,48,57,
65,90,95,95,97,122,2,0,10,10,13,13,3,0,9,11,13,13,32,32,2,0,65,65,97,97,
2,0,66,66,98,98,2,0,67,67,99,99,2,0,68,68,100,100,2,0,69,69,101,101,2,0,
70,70,102,102,2,0,71,71,103,103,2,0,72,72,104,104,2,0,73,73,105,105,2,0,
74,74,106,106,2,0,75,75,107,107,2,0,76,76,108,108,2,0,77,77,109,109,2,0,
78,78,110,110,2,0,79,79,111,111,2,0,80,80,112,112,2,0,81,81,113,113,2,0,
82,82,114,114,2,0,83,83,115,115,2,0,84,84,116,116,2,0,85,85,117,117,2,0,
86,86,118,118,2,0,87,87,119,119,2,0,88,88,120,120,2,0,89,89,121,121,2,0,
90,90,122,122,8,0,34,34,47,47,92,92,98,98,102,102,110,110,114,114,116,116,
3,0,48,57,65,70,97,102,3,0,0,31,34,34,92,92,1,0,49,57,2,0,43,43,45,45,961,
0,1,1,0,0,0,0,3,1,0,0,0,0,5,1,0,0,0,0,7,1,0,0,0,0,9,1,0,0,0,0,11,1,0,0,0,
0,13,1,0,0,0,0,15,1,0,0,0,0,17,1,0,0,0,0,19,1,0,0,0,0,21,1,0,0,0,0,23,1,
0,0,0,0,25,1,0,0,0,0,27,1,0,0,0,0,29,1,0,0,0,0,31,1,0,0,0,0,33,1,0,0,0,0,
35,1,0,0,0,0,37,1,0,0,0,0,39,1,0,0,0,0,41,1,0,0,0,0,43,1,0,0,0,0,45,1,0,
0,0,0,47,1,0,0,0,0,49,1,0,0,0,0,51,1,0,0,0,0,53,1,0,0,0,0,55,1,0,0,0,0,57,
1,0,0,0,0,59,1,0,0,0,0,61,1,0,0,0,0,63,1,0,0,0,0,65,1,0,0,0,0,67,1,0,0,0,
0,69,1,0,0,0,0,71,1,0,0,0,0,73,1,0,0,0,0,75,1,0,0,0,0,77,1,0,0,0,0,79,1,
0,0,0,0,81,1,0,0,0,0,83,1,0,0,0,0,85,1,0,0,0,0,87,1,0,0,0,0,89,1,0,0,0,0,
91,1,0,0,0,0,93,1,0,0,0,0,95,1,0,0,0,0,97,1,0,0,0,0,99,1,0,0,0,0,101,1,0,
0,0,0,103,1,0,0,0,0,105,1,0,0,0,0,107,1,0,0,0,0,109,1,0,0,0,0,111,1,0,0,
0,0,113,1,0,0,0,0,115,1,0,0,0,0,117,1,0,0,0,0,119,1,0,0,0,0,121,1,0,0,0,
0,123,1,0,0,0,0,125,1,0,0,0,0,127,1,0,0,0,0,129,1,0,0,0,0,131,1,0,0,0,0,
133,1,0,0,0,0,135,1,0,0,0,0,137,1,0,0,0,0,139,1,0,0,0,0,141,1,0,0,0,0,143,
1,0,0,0,0,145,1,0,0,0,0,147,1,0,0,0,0,149,1,0,0,0,0,151,1,0,0,0,0,153,1,
0,0,0,0,155,1,0,0,0,0,157,1,0,0,0,0,159,1,0,0,0,0,161,1,0,0,0,0,163,1,0,
0,0,0,165,1,0,0,0,0,167,1,0,0,0,0,169,1,0,0,0,0,171,1,0,0,0,0,173,1,0,0,
0,0,175,1,0,0,0,0,177,1,0,0,0,0,179,1,0,0,0,0,181,1,0,0,0,0,183,1,0,0,0,
0,185,1,0,0,0,0,187,1,0,0,0,0,189,1,0,0,0,0,191,1,0,0,0,0,193,1,0,0,0,0,
195,1,0,0,0,0,197,1,0,0,0,1,265,1,0,0,0,3,267,1,0,0,0,5,269,1,0,0,0,7,274,
1,0,0,0,9,277,1,0,0,0,11,287,1,0,0,0,13,289,1,0,0,0,15,295,1,0,0,0,17,297,
1,0,0,0,19,301,1,0,0,0,21,303,1,0,0,0,23,306,1,0,0,0,25,308,1,0,0,0,27,312,
1,0,0,0,29,316,1,0,0,0,31,321,1,0,0,0,33,326,1,0,0,0,35,330,1,0,0,0,37,334,
1,0,0,0,39,338,1,0,0,0,41,342,1,0,0,0,43,346,1,0,0,0,45,350,1,0,0,0,47,352,
1,0,0,0,49,354,1,0,0,0,51,356,1,0,0,0,53,368,1,0,0,0,55,401,1,0,0,0,57,403,
1,0,0,0,59,405,1,0,0,0,61,423,1,0,0,0,63,432,1,0,0,0,65,436,1,0,0,0,67,439,
1,0,0,0,69,447,1,0,0,0,71,453,1,0,0,0,73,459,1,0,0,0,75,463,1,0,0,0,77,473,
1,0,0,0,79,479,1,0,0,0,81,493,1,0,0,0,83,503,1,0,0,0,85,511,1,0,0,0,87,518,
1,0,0,0,89,525,1,0,0,0,91,528,1,0,0,0,93,531,1,0,0,0,95,537,1,0,0,0,97,548,
1,0,0,0,99,551,1,0,0,0,101,556,1,0,0,0,103,564,1,0,0,0,105,571,1,0,0,0,107,
580,1,0,0,0,109,586,1,0,0,0,111,592,1,0,0,0,113,597,1,0,0,0,115,602,1,0,
0,0,117,608,1,0,0,0,119,611,1,0,0,0,121,619,1,0,0,0,123,626,1,0,0,0,125,
634,1,0,0,0,127,638,1,0,0,0,129,645,1,0,0,0,131,649,1,0,0,0,133,656,1,0,
0,0,135,661,1,0,0,0,137,664,1,0,0,0,139,668,1,0,0,0,141,676,1,0,0,0,143,
683,1,0,0,0,145,694,1,0,0,0,147,701,1,0,0,0,149,708,1,0,0,0,151,716,1,0,
0,0,153,723,1,0,0,0,155,728,1,0,0,0,157,733,1,0,0,0,159,741,1,0,0,0,161,
746,1,0,0,0,163,751,1,0,0,0,165,754,1,0,0,0,167,758,1,0,0,0,169,766,1,0,
0,0,171,771,1,0,0,0,173,783,1,0,0,0,175,794,1,0,0,0,177,800,1,0,0,0,179,
805,1,0,0,0,181,812,1,0,0,0,183,820,1,0,0,0,185,824,1,0,0,0,187,839,1,0,
0,0,189,846,1,0,0,0,191,857,1,0,0,0,193,873,1,0,0,0,195,882,1,0,0,0,197,
886,1,0,0,0,199,888,1,0,0,0,201,890,1,0,0,0,203,892,1,0,0,0,205,894,1,0,
0,0,207,896,1,0,0,0,209,898,1,0,0,0,211,900,1,0,0,0,213,902,1,0,0,0,215,
904,1,0,0,0,217,906,1,0,0,0,219,908,1,0,0,0,221,910,1,0,0,0,223,912,1,0,
0,0,225,914,1,0,0,0,227,916,1,0,0,0,229,918,1,0,0,0,231,920,1,0,0,0,233,
922,1,0,0,0,235,924,1,0,0,0,237,926,1,0,0,0,239,928,1,0,0,0,241,930,1,0,
0,0,243,932,1,0,0,0,245,934,1,0,0,0,247,936,1,0,0,0,249,938,1,0,0,0,251,
940,1,0,0,0,253,942,1,0,0,0,255,947,1,0,0,0,257,953,1,0,0,0,259,955,1,0,
0,0,261,965,1,0,0,0,263,967,1,0,0,0,265,266,5,123,0,0,266,2,1,0,0,0,267,
268,5,125,0,0,268,4,1,0,0,0,269,270,5,46,0,0,270,271,5,99,0,0,271,272,5,
115,0,0,272,273,5,118,0,0,273,6,1,0,0,0,274,275,5,45,0,0,275,276,5,62,0,
0,276,8,1,0,0,0,277,278,5,46,0,0,278,279,5,115,0,0,279,280,5,97,0,0,280,
281,5,115,0,0,281,282,5,55,0,0,282,283,5,98,0,0,283,284,5,100,0,0,284,285,
5,97,0,0,285,286,5,116,0,0,286,10,1,0,0,0,287,288,5,46,0,0,288,12,1,0,0,
0,289,290,5,115,0,0,290,291,5,51,0,0,291,292,5,58,0,0,292,293,5,47,0,0,293,
294,5,47,0,0,294,14,1,0,0,0,295,296,5,47,0,0,296,16,1,0,0,0,297,298,5,46,
0,0,298,299,5,103,0,0,299,300,5,122,0,0,300,18,1,0,0,0,301,302,5,45,0,0,
302,20,1,0,0,0,303,304,5,36,0,0,304,305,5,123,0,0,305,22,1,0,0,0,306,307,
5,61,0,0,307,24,1,0,0,0,308,309,5,34,0,0,309,310,5,44,0,0,310,311,5,34,0,
0,311,26,1,0,0,0,312,313,5,39,0,0,313,314,5,44,0,0,314,315,5,39,0,0,315,
28,1,0,0,0,316,317,5,34,0,0,317,318,5,92,0,0,318,319,5,116,0,0,319,320,5,
34,0,0,320,30,1,0,0,0,321,322,5,39,0,0,322,323,5,92,0,0,323,324,5,116,0,
0,324,325,5,39,0,0,325,32,1,0,0,0,326,327,5,34,0,0,327,328,5,32,0,0,328,
329,5,34,0,0,329,34,1,0,0,0,330,331,5,39,0,0,331,332,5,32,0,0,332,333,5,
39,0,0,333,36,1,0,0,0,334,335,5,34,0,0,335,336,5,59,0,0,336,337,5,34,0,0,
337,38,1,0,0,0,338,339,5,39,0,0,339,340,5,59,0,0,340,341,5,39,0,0,341,40,
1,0,0,0,342,343,5,34,0,0,343,344,5,124,0,0,344,345,5,34,0,0,345,42,1,0,0,
0,346,347,5,39,0,0,347,348,5,124,0,0,348,349,5,39,0,0,349,44,1,0,0,0,350,
351,5,44,0,0,351,46,1,0,0,0,352,353,5,40,0,0,353,48,1,0,0,0,354,355,5,41,
0,0,355,50,1,0,0,0,356,357,4,25,0,0,357,361,3,145,72,0,358,360,9,0,0,0,359,
358,1,0,0,0,360,363,1,0,0,0,361,362,1,0,0,0,361,359,1,0,0,0,362,364,1,0,
0,0,363,361,1,0,0,0,364,365,3,57,28,0,365,366,6,25,0,0,366,52,1,0,0,0,367,
369,5,45,0,0,368,367,1,0,0,0,368,369,1,0,0,0,369,370,1,0,0,0,370,377,3,261,
130,0,371,373,5,46,0,0,372,374,7,0,0,0,373,372,1,0,0,0,374,375,1,0,0,0,375,
373,1,0,0,0,375,376,1,0,0,0,376,378,1,0,0,0,377,371,1,0,0,0,377,378,1,0,
0,0,378,380,1,0,0,0,379,381,3,263,131,0,380,379,1,0,0,0,380,381,1,0,0,0,
381,54,1,0,0,0,382,388,5,34,0,0,383,387,8,1,0,0,384,387,3,253,126,0,385,
387,3,259,129,0,386,383,1,0,0,0,386,384,1,0,0,0,386,385,1,0,0,0,387,390,
1,0,0,0,388,386,1,0,0,0,388,389,1,0,0,0,389,391,1,0,0,0,390,388,1,0,0,0,
391,402,5,34,0,0,392,397,5,39,0,0,393,396,8,2,0,0,394,396,3,253,126,0,395,
393,1,0,0,0,395,394,1,0,0,0,396,399,1,0,0,0,397,395,1,0,0,0,397,398,1,0,
0,0,398,400,1,0,0,0,399,397,1,0,0,0,400,402,5,39,0,0,401,382,1,0,0,0,401,
392,1,0,0,0,402,56,1,0,0,0,403,404,5,59,0,0,404,58,1,0,0,0,405,406,3,205,
102,0,406,407,3,215,107,0,407,408,3,209,104,0,408,409,3,205,102,0,409,410,
3,221,110,0,410,411,5,95,0,0,411,412,3,205,102,0,412,413,3,229,114,0,413,
414,3,227,113,0,414,415,3,237,118,0,415,416,3,239,119,0,416,417,3,235,117,
0,417,418,3,201,100,0,418,419,3,217,108,0,419,420,3,227,113,0,420,421,3,
239,119,0,421,422,3,237,118,0,422,60,1,0,0,0,423,424,3,205,102,0,424,425,
3,229,114,0,425,426,3,225,112,0,426,427,3,231,115,0,427,428,3,235,117,0,
428,429,3,209,104,0,429,430,3,237,118,0,430,431,3,237,118,0,431,62,1,0,0,
0,432,433,3,205,102,0,433,434,3,237,118,0,434,435,3,243,121,0,435,64,1,0,
0,0,436,437,3,207,103,0,437,438,3,203,101,0,438,66,1,0,0,0,439,440,3,207,
103,0,440,441,3,209,104,0,441,442,3,211,105,0,442,443,3,201,100,0,443,444,
3,241,120,0,444,445,3,223,111,0,445,446,3,239,119,0,446,68,1,0,0,0,447,448,
3,207,103,0,448,449,3,209,104,0,449,450,3,237,118,0,450,451,3,205,102,0,
451,452,3,235,117,0,452,70,1,0,0,0,453,454,3,207,103,0,454,455,3,209,104,
0,455,456,3,223,111,0,456,457,3,217,108,0,457,458,3,225,112,0,458,72,1,0,
0,0,459,460,3,207,103,0,460,461,3,249,124,0,461,462,3,227,113,0,462,74,1,
0,0,0,463,464,3,209,104,0,464,465,3,247,123,0,465,466,3,209,104,0,466,467,
3,205,102,0,467,468,5,95,0,0,468,469,3,245,122,0,469,470,3,215,107,0,470,
471,3,209,104,0,471,472,3,227,113,0,472,76,1,0,0,0,473,474,3,211,105,0,474,
475,3,201,100,0,475,476,3,223,111,0,476,477,3,237,118,0,477,478,3,209,104,
0,478,78,1,0,0,0,479,480,3,211,105,0,480,481,3,217,108,0,481,482,3,235,117,
0,482,483,3,209,104,0,483,484,5,95,0,0,484,485,3,239,119,0,485,486,3,235,
117,0,486,487,3,217,108,0,487,488,3,213,106,0,488,489,3,213,106,0,489,490,
3,209,104,0,490,491,3,235,117,0,491,492,3,237,118,0,492,80,1,0,0,0,493,494,
3,211,105,0,494,495,3,235,117,0,495,496,3,201,100,0,496,497,3,225,112,0,
497,498,3,209,104,0,498,499,3,245,122,0,499,500,3,229,114,0,500,501,3,235,
117,0,501,502,3,221,110,0,502,82,1,0,0,0,503,504,3,213,106,0,504,505,3,209,
104,0,505,506,3,239,119,0,506,507,3,211,105,0,507,508,3,201,100,0,508,509,
3,205,102,0,509,510,3,239,119,0,510,84,1,0,0,0,511,512,3,213,106,0,512,513,
3,209,104,0,513,514,3,239,119,0,514,515,3,207,103,0,515,516,3,249,124,0,
516,517,3,227,113,0,517,86,1,0,0,0,518,519,3,213,106,0,519,520,3,209,104,
0,520,521,3,239,119,0,521,522,3,237,118,0,522,523,3,217,108,0,523,524,3,
213,106,0,524,88,1,0,0,0,525,526,3,213,106,0,526,527,3,229,114,0,527,90,
1,0,0,0,528,529,3,217,108,0,529,530,3,227,113,0,530,92,1,0,0,0,531,532,3,
217,108,0,532,533,3,227,113,0,533,534,3,231,115,0,534,535,3,241,120,0,535,
536,3,239,119,0,536,94,1,0,0,0,537,538,3,221,110,0,538,539,3,209,104,0,539,
540,3,209,104,0,540,541,3,231,115,0,541,542,5,95,0,0,542,543,3,227,113,0,
543,544,3,241,120,0,544,545,3,223,111,0,545,546,3,223,111,0,546,547,3,237,
118,0,547,96,1,0,0,0,548,549,3,221,110,0,549,550,3,203,101,0,550,98,1,0,
0,0,551,552,3,223,111,0,552,553,3,201,100,0,553,554,3,227,113,0,554,555,
3,213,106,0,555,100,1,0,0,0,556,557,3,237,118,0,557,558,3,201,100,0,558,
559,3,237,118,0,559,560,3,211,105,0,560,561,3,217,108,0,561,562,3,223,111,
0,562,563,3,209,104,0,563,102,1,0,0,0,564,565,3,225,112,0,565,566,3,209,
104,0,566,567,3,225,112,0,567,568,3,229,114,0,568,569,3,235,117,0,569,570,
3,249,124,0,570,104,1,0,0,0,571,572,3,225,112,0,572,573,3,217,108,0,573,
574,3,227,113,0,574,575,3,217,108,0,575,576,3,225,112,0,576,577,3,217,108,
0,577,578,3,251,125,0,578,579,3,209,104,0,579,106,1,0,0,0,580,581,3,225,
112,0,581,582,3,229,114,0,582,583,3,207,103,0,583,584,3,209,104,0,584,585,
3,223,111,0,585,108,1,0,0,0,586,587,3,225,112,0,587,588,3,237,118,0,588,
589,3,237,118,0,589,590,3,233,116,0,590,591,3,223,111,0,591,110,1,0,0,0,
592,593,3,227,113,0,593,594,3,201,100,0,594,595,3,225,112,0,595,596,3,209,
104,0,596,112,1,0,0,0,597,598,3,227,113,0,598,599,3,229,114,0,599,600,3,
207,103,0,600,601,3,209,104,0,601,114,1,0,0,0,602,603,3,229,114,0,603,604,
3,235,117,0,604,605,3,207,103,0,605,606,3,209,104,0,606,607,3,235,117,0,
607,116,1,0,0,0,608,609,3,231,115,0,609,610,3,213,106,0,610,118,1,0,0,0,
611,612,3,231,115,0,612,613,3,235,117,0,613,614,3,229,114,0,614,615,3,205,
102,0,615,616,3,209,104,0,616,617,3,237,118,0,617,618,3,237,118,0,618,120,
1,0,0,0,619,620,3,231,115,0,620,621,3,249,124,0,621,622,3,239,119,0,622,
623,3,215,107,0,623,624,3,229,114,0,624,625,3,227,113,0,625,122,1,0,0,0,
626,627,3,231,115,0,627,628,3,235,117,0,628,629,3,209,104,0,629,630,3,207,
103,0,630,631,3,217,108,0,631,632,3,205,102,0,632,633,3,239,119,0,633,124,
1,0,0,0,634,635,3,229,114,0,635,636,3,241,120,0,636,637,3,239,119,0,637,
126,1,0,0,0,638,639,3,229,114,0,639,640,3,241,120,0,640,641,3,239,119,0,
641,642,3,231,115,0,642,643,3,241,120,0,643,644,3,239,119,0,644,128,1,0,
0,0,645,646,3,229,114,0,646,647,3,231,115,0,647,648,3,239,119,0,648,130,
1,0,0,0,649,650,3,235,117,0,650,651,3,209,104,0,651,652,3,231,115,0,652,
653,3,229,114,0,653,654,3,235,117,0,654,655,3,239,119,0,655,132,1,0,0,0,
656,657,3,235,117,0,657,658,3,229,114,0,658,659,3,245,122,0,659,660,3,237,
118,0,660,134,1,0,0,0,661,662,3,237,118,0,662,663,5,51,0,0,663,136,1,0,0,
0,664,665,3,237,118,0,665,666,3,201,100,0,666,667,3,237,118,0,667,138,1,
0,0,0,668,669,3,237,118,0,669,670,3,201,100,0,670,671,3,237,118,0,671,672,
3,245,122,0,672,673,3,229,114,0,673,674,3,235,117,0,674,675,3,221,110,0,
675,140,1,0,0,0,676,677,3,237,118,0,677,678,3,201,100,0,678,679,3,237,118,
0,679,680,3,205,102,0,680,681,3,225,112,0,681,682,3,207,103,0,682,142,1,
0,0,0,683,684,3,237,118,0,684,685,3,205,102,0,685,686,3,209,104,0,686,687,
3,227,113,0,687,688,3,201,100,0,688,689,3,235,117,0,689,690,3,217,108,0,
690,691,3,229,114,0,691,692,3,207,103,0,692,693,3,237,118,0,693,144,1,0,
0,0,694,695,3,237,118,0,695,696,3,209,104,0,696,697,3,223,111,0,697,698,
3,209,104,0,698,699,3,205,102,0,699,700,3,239,119,0,700,146,1,0,0,0,701,
702,3,237,118,0,702,703,3,209,104,0,703,704,3,239,119,0,704,705,3,237,118,
0,705,706,3,217,108,0,706,707,3,213,106,0,707,148,1,0,0,0,708,709,3,237,
118,0,709,710,3,209,104,0,710,711,3,239,119,0,711,712,3,211,105,0,712,713,
3,201,100,0,713,714,3,205,102,0,714,715,3,239,119,0,715,150,1,0,0,0,716,
717,3,237,118,0,717,718,3,209,104,0,718,719,3,239,119,0,719,720,3,207,103,
0,720,721,3,249,124,0,721,722,3,227,113,0,722,152,1,0,0,0,723,724,3,237,
118,0,724,725,3,233,116,0,725,726,3,223,111,0,726,727,6,76,1,0,727,154,1,
0,0,0,728,729,3,239,119,0,729,730,3,217,108,0,730,731,3,225,112,0,731,732,
3,209,104,0,732,156,1,0,0,0,733,734,3,239,119,0,734,735,3,201,100,0,735,
736,3,203,101,0,736,737,3,223,111,0,737,738,3,229,114,0,738,739,3,205,102,
0,739,740,3,221,110,0,740,158,1,0,0,0,741,742,3,239,119,0,742,743,3,235,
117,0,743,744,3,241,120,0,744,745,3,209,104,0,745,160,1,0,0,0,746,747,3,
239,119,0,747,748,3,249,124,0,748,749,3,231,115,0,749,750,3,209,104,0,750,
162,1,0,0,0,751,752,3,207,103,0,752,753,3,237,118,0,753,164,1,0,0,0,754,
755,3,207,103,0,755,756,3,237,118,0,756,757,3,227,113,0,757,166,1,0,0,0,
758,759,3,207,103,0,759,760,3,201,100,0,760,761,3,239,119,0,761,762,3,201,
100,0,762,763,3,237,118,0,763,764,3,209,104,0,764,765,3,239,119,0,765,168,
1,0,0,0,766,767,3,231,115,0,767,768,3,201,100,0,768,769,3,235,117,0,769,
770,3,239,119,0,770,170,1,0,0,0,771,772,3,231,115,0,772,773,3,201,100,0,
773,774,3,235,117,0,774,775,3,239,119,0,775,776,3,217,108,0,776,777,3,239,
119,0,777,778,3,217,108,0,778,779,3,229,114,0,779,780,3,227,113,0,780,781,
3,209,104,0,781,782,3,207,103,0,782,172,1,0,0,0,783,784,3,237,118,0,784,
785,3,241,120,0,785,786,3,203,101,0,786,787,3,231,115,0,787,788,3,235,117,
0,788,789,3,229,114,0,789,790,3,205,102,0,790,791,3,209,104,0,791,792,3,
237,118,0,792,793,3,237,118,0,793,174,1,0,0,0,794,795,3,245,122,0,795,796,
3,215,107,0,796,797,3,209,104,0,797,798,3,235,117,0,798,799,3,209,104,0,
799,176,1,0,0,0,800,801,3,225,112,0,801,802,3,229,114,0,802,803,3,207,103,
0,803,804,3,209,104,0,804,178,1,0,0,0,805,806,3,201,100,0,806,807,3,231,
115,0,807,808,3,231,115,0,808,809,3,209,104,0,809,810,3,227,113,0,810,811,
3,207,103,0,811,180,1,0,0,0,812,813,3,235,117,0,813,814,3,209,104,0,814,
815,3,231,115,0,815,816,3,223,111,0,816,817,3,201,100,0,817,818,3,205,102,
0,818,819,3,209,104,0,819,182,1,0,0,0,820,821,3,243,121,0,821,822,3,201,
100,0,822,823,3,235,117,0,823,184,1,0,0,0,824,825,3,237,118,0,825,826,3,
249,124,0,826,827,3,227,113,0,827,828,3,239,119,0,828,829,3,201,100,0,829,
830,3,247,123,0,830,831,5,95,0,0,831,832,3,243,121,0,832,833,3,209,104,0,
833,834,3,235,117,0,834,835,3,237,118,0,835,836,3,217,108,0,836,837,3,229,
114,0,837,838,3,227,113,0,838,186,1,0,0,0,839,843,7,3,0,0,840,842,7,4,0,
0,841,840,1,0,0,0,842,845,1,0,0,0,843,841,1,0,0,0,843,844,1,0,0,0,844,188,
1,0,0,0,845,843,1,0,0,0,846,847,5,47,0,0,847,848,5,47,0,0,848,852,1,0,0,
0,849,851,8,5,0,0,850,849,1,0,0,0,851,854,1,0,0,0,852,850,1,0,0,0,852,853,
1,0,0,0,853,855,1,0,0,0,854,852,1,0,0,0,855,856,6,94,2,0,856,190,1,0,0,0,
857,858,5,47,0,0,858,859,5,42,0,0,859,863,1,0,0,0,860,862,9,0,0,0,861,860,
1,0,0,0,862,865,1,0,0,0,863,864,1,0,0,0,863,861,1,0,0,0,864,869,1,0,0,0,
865,863,1,0,0,0,866,867,5,42,0,0,867,870,5,47,0,0,868,870,5,0,0,1,869,866,
1,0,0,0,869,868,1,0,0,0,870,871,1,0,0,0,871,872,6,95,2,0,872,192,1,0,0,0,
873,874,7,6,0,0,874,875,1,0,0,0,875,876,6,96,2,0,876,194,1,0,0,0,877,879,
5,13,0,0,878,877,1,0,0,0,878,879,1,0,0,0,879,880,1,0,0,0,880,883,5,10,0,
0,881,883,5,13,0,0,882,878,1,0,0,0,882,881,1,0,0,0,883,884,1,0,0,0,884,882,
1,0,0,0,884,885,1,0,0,0,885,196,1,0,0,0,886,887,9,0,0,0,887,198,1,0,0,0,
888,889,7,0,0,0,889,200,1,0,0,0,890,891,7,7,0,0,891,202,1,0,0,0,892,893,
7,8,0,0,893,204,1,0,0,0,894,895,7,9,0,0,895,206,1,0,0,0,896,897,7,10,0,0,
897,208,1,0,0,0,898,899,7,11,0,0,899,210,1,0,0,0,900,901,7,12,0,0,901,212,
1,0,0,0,902,903,7,13,0,0,903,214,1,0,0,0,904,905,7,14,0,0,905,216,1,0,0,
0,906,907,7,15,0,0,907,218,1,0,0,0,908,909,7,16,0,0,909,220,1,0,0,0,910,
911,7,17,0,0,911,222,1,0,0,0,912,913,7,18,0,0,913,224,1,0,0,0,914,915,7,
19,0,0,915,226,1,0,0,0,916,917,7,20,0,0,917,228,1,0,0,0,918,919,7,21,0,0,
919,230,1,0,0,0,920,921,7,22,0,0,921,232,1,0,0,0,922,923,7,23,0,0,923,234,
1,0,0,0,924,925,7,24,0,0,925,236,1,0,0,0,926,927,7,25,0,0,927,238,1,0,0,
0,928,929,7,26,0,0,929,240,1,0,0,0,930,931,7,27,0,0,931,242,1,0,0,0,932,
933,7,28,0,0,933,244,1,0,0,0,934,935,7,29,0,0,935,246,1,0,0,0,936,937,7,
30,0,0,937,248,1,0,0,0,938,939,7,31,0,0,939,250,1,0,0,0,940,941,7,32,0,0,
941,252,1,0,0,0,942,945,5,92,0,0,943,946,7,33,0,0,944,946,3,255,127,0,945,
943,1,0,0,0,945,944,1,0,0,0,946,254,1,0,0,0,947,948,5,117,0,0,948,949,3,
257,128,0,949,950,3,257,128,0,950,951,3,257,128,0,951,952,3,257,128,0,952,
256,1,0,0,0,953,954,7,34,0,0,954,258,1,0,0,0,955,956,8,35,0,0,956,260,1,
0,0,0,957,966,5,48,0,0,958,962,7,36,0,0,959,961,7,0,0,0,960,959,1,0,0,0,
961,964,1,0,0,0,962,960,1,0,0,0,962,963,1,0,0,0,963,966,1,0,0,0,964,962,
1,0,0,0,965,957,1,0,0,0,965,958,1,0,0,0,966,262,1,0,0,0,967,969,7,11,0,0,
968,970,7,37,0,0,969,968,1,0,0,0,969,970,1,0,0,0,970,971,1,0,0,0,971,972,
3,261,130,0,972,264,1,0,0,0,22,0,361,368,375,377,380,386,388,395,397,401,
843,852,863,869,878,882,884,945,962,965,969,3,1,25,0,1,76,1,6,0,0];


const atn = new antlr4.atn.ATNDeserializer().deserialize(serializedATN);

const decisionsToDFA = atn.decisionToState.map( (ds, index) => new antlr4.dfa.DFA(ds, index) );

export default class processLexer extends antlr4.Lexer {

    static grammarFileName = "process.g4";
    static channelNames = [ "DEFAULT_TOKEN_CHANNEL", "HIDDEN" ];
	static modeNames = [ "DEFAULT_MODE" ];
	static literalNames = [ null, "'{'", "'}'", "'.csv'", "'->'", "'.sas7bdat'", 
                         "'.'", "'s3://'", "'/'", "'.gz'", "'-'", "'${'", 
                         "'='", "'\",\"'", "'',''", "'\"\\t\"'", "''\\t''", 
                         "'\" \"'", "'' ''", "'\";\"'", "'';''", "'\"|\"'", 
                         "''|''", "','", "'('", "')'", null, null, null, 
                         "';'" ];
	static symbolicNames = [ null, null, null, null, null, null, null, null, 
                          null, null, null, null, null, null, null, null, 
                          null, null, null, null, null, null, null, null, 
                          null, null, "SQLSTMTSEMICOLON", "NUMBER", "STRING", 
                          "SCOL", "CHECK_CONSTRAINTS", "COMPRESS", "CSV", 
                          "DB", "DEFAULT", "DESCR", "DELIM", "DYN", "EXEC_WHEN", 
                          "FALSE", "FIRE_TRIGGERS", "FRAMEWORK", "GETFACT", 
                          "GETDYN", "GETSIG", "GO", "IN", "INPUT", "KEEP_NULLS", 
                          "KB", "LANG", "SASFILE", "MEMORY", "MINIMIZE", 
                          "MODEL", "MSSQL", "NAME", "NODE", "ORDER", "PG", 
                          "PROCESS", "PYTHON", "PREDICT", "OUT", "OUTPUT", 
                          "OPT", "REPORT", "ROWS", "S3", "SAS", "SASWORK", 
                          "SASCMD", "SCENARIODS", "SELECT", "SETSIG", "SETFACT", 
                          "SETDYN", "SQL", "TIME", "TABLOCK", "TRUE", "TYPE", 
                          "DS", "DSN", "DATASET", "PART", "PARTITIONED", 
                          "SUBPROCESS", "WHERE", "MODE", "APPEND", "REPLACE", 
                          "VAR", "SYNTAX_VERSION", "IDENTIFIER", "SINGLE_LINE_COMMENT", 
                          "MULTILINE_COMMENT", "SPACES", "NEWLINE", "UNEXPECTED_CHAR" ];
	static ruleNames = [ "T__0", "T__1", "T__2", "T__3", "T__4", "T__5", "T__6", 
                      "T__7", "T__8", "T__9", "T__10", "T__11", "T__12", 
                      "T__13", "T__14", "T__15", "T__16", "T__17", "T__18", 
                      "T__19", "T__20", "T__21", "T__22", "T__23", "T__24", 
                      "SQLSTMTSEMICOLON", "NUMBER", "STRING", "SCOL", "CHECK_CONSTRAINTS", 
                      "COMPRESS", "CSV", "DB", "DEFAULT", "DESCR", "DELIM", 
                      "DYN", "EXEC_WHEN", "FALSE", "FIRE_TRIGGERS", "FRAMEWORK", 
                      "GETFACT", "GETDYN", "GETSIG", "GO", "IN", "INPUT", 
                      "KEEP_NULLS", "KB", "LANG", "SASFILE", "MEMORY", "MINIMIZE", 
                      "MODEL", "MSSQL", "NAME", "NODE", "ORDER", "PG", "PROCESS", 
                      "PYTHON", "PREDICT", "OUT", "OUTPUT", "OPT", "REPORT", 
                      "ROWS", "S3", "SAS", "SASWORK", "SASCMD", "SCENARIODS", 
                      "SELECT", "SETSIG", "SETFACT", "SETDYN", "SQL", "TIME", 
                      "TABLOCK", "TRUE", "TYPE", "DS", "DSN", "DATASET", 
                      "PART", "PARTITIONED", "SUBPROCESS", "WHERE", "MODE", 
                      "APPEND", "REPLACE", "VAR", "SYNTAX_VERSION", "IDENTIFIER", 
                      "SINGLE_LINE_COMMENT", "MULTILINE_COMMENT", "SPACES", 
                      "NEWLINE", "UNEXPECTED_CHAR", "DIGIT", "A", "B", "C", 
                      "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", 
                      "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", 
                      "X", "Y", "Z", "ESC", "UNICODE", "HEX", "SAFECODEPOINT", 
                      "INT", "EXP" ];

    constructor(input) {
        super(input)
        this._interp = new antlr4.atn.LexerATNSimulator(this, atn, decisionsToDFA, new antlr4.atn.PredictionContextCache());
    }
}

processLexer.EOF = antlr4.Token.EOF;
processLexer.T__0 = 1;
processLexer.T__1 = 2;
processLexer.T__2 = 3;
processLexer.T__3 = 4;
processLexer.T__4 = 5;
processLexer.T__5 = 6;
processLexer.T__6 = 7;
processLexer.T__7 = 8;
processLexer.T__8 = 9;
processLexer.T__9 = 10;
processLexer.T__10 = 11;
processLexer.T__11 = 12;
processLexer.T__12 = 13;
processLexer.T__13 = 14;
processLexer.T__14 = 15;
processLexer.T__15 = 16;
processLexer.T__16 = 17;
processLexer.T__17 = 18;
processLexer.T__18 = 19;
processLexer.T__19 = 20;
processLexer.T__20 = 21;
processLexer.T__21 = 22;
processLexer.T__22 = 23;
processLexer.T__23 = 24;
processLexer.T__24 = 25;
processLexer.SQLSTMTSEMICOLON = 26;
processLexer.NUMBER = 27;
processLexer.STRING = 28;
processLexer.SCOL = 29;
processLexer.CHECK_CONSTRAINTS = 30;
processLexer.COMPRESS = 31;
processLexer.CSV = 32;
processLexer.DB = 33;
processLexer.DEFAULT = 34;
processLexer.DESCR = 35;
processLexer.DELIM = 36;
processLexer.DYN = 37;
processLexer.EXEC_WHEN = 38;
processLexer.FALSE = 39;
processLexer.FIRE_TRIGGERS = 40;
processLexer.FRAMEWORK = 41;
processLexer.GETFACT = 42;
processLexer.GETDYN = 43;
processLexer.GETSIG = 44;
processLexer.GO = 45;
processLexer.IN = 46;
processLexer.INPUT = 47;
processLexer.KEEP_NULLS = 48;
processLexer.KB = 49;
processLexer.LANG = 50;
processLexer.SASFILE = 51;
processLexer.MEMORY = 52;
processLexer.MINIMIZE = 53;
processLexer.MODEL = 54;
processLexer.MSSQL = 55;
processLexer.NAME = 56;
processLexer.NODE = 57;
processLexer.ORDER = 58;
processLexer.PG = 59;
processLexer.PROCESS = 60;
processLexer.PYTHON = 61;
processLexer.PREDICT = 62;
processLexer.OUT = 63;
processLexer.OUTPUT = 64;
processLexer.OPT = 65;
processLexer.REPORT = 66;
processLexer.ROWS = 67;
processLexer.S3 = 68;
processLexer.SAS = 69;
processLexer.SASWORK = 70;
processLexer.SASCMD = 71;
processLexer.SCENARIODS = 72;
processLexer.SELECT = 73;
processLexer.SETSIG = 74;
processLexer.SETFACT = 75;
processLexer.SETDYN = 76;
processLexer.SQL = 77;
processLexer.TIME = 78;
processLexer.TABLOCK = 79;
processLexer.TRUE = 80;
processLexer.TYPE = 81;
processLexer.DS = 82;
processLexer.DSN = 83;
processLexer.DATASET = 84;
processLexer.PART = 85;
processLexer.PARTITIONED = 86;
processLexer.SUBPROCESS = 87;
processLexer.WHERE = 88;
processLexer.MODE = 89;
processLexer.APPEND = 90;
processLexer.REPLACE = 91;
processLexer.VAR = 92;
processLexer.SYNTAX_VERSION = 93;
processLexer.IDENTIFIER = 94;
processLexer.SINGLE_LINE_COMMENT = 95;
processLexer.MULTILINE_COMMENT = 96;
processLexer.SPACES = 97;
processLexer.NEWLINE = 98;
processLexer.UNEXPECTED_CHAR = 99;

processLexer.prototype.action = function(localctx, ruleIndex, actionIndex) {
	switch (ruleIndex) {
	case 25:
		this.SQLSTMTSEMICOLON_action(localctx, actionIndex);
		break;
	case 76:
		this.SQL_action(localctx, actionIndex);
		break;
	default:
		throw "No registered action for:" + ruleIndex;
	}
};


processLexer.prototype.SQLSTMTSEMICOLON_action = function(localctx , actionIndex) {
	switch (actionIndex) {
	case 0:
		isSQLStmt=false
		break;
	default:
		throw "No registered action for:" + actionIndex;
	}
};

processLexer.prototype.SQL_action = function(localctx , actionIndex) {
	switch (actionIndex) {
	case 1:
		isSQLStmt = true
		break;
	default:
		throw "No registered action for:" + actionIndex;
	}
};
processLexer.prototype.sempred = function(localctx, ruleIndex, predIndex) {
	switch (ruleIndex) {
		case 25:
			return this.SQLSTMTSEMICOLON_sempred(localctx, predIndex);
    	default:
    		throw "No registered predicate for:" + ruleIndex;
    }
};

processLexer.prototype.SQLSTMTSEMICOLON_sempred = function(localctx, predIndex) {
	switch(predIndex) {
		case 0:
			return isSQLStmt;
		default:
			throw "No predicate with index:" + predIndex;
	}
};




