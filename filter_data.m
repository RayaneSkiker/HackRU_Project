% matlab script to process bus dataset from https://www.njtransit.com/hackru-fall-2024
routes = readtable("routes.xlsx");
stops = readtable("stops.txt");

% find nb stops only
new_brunswick = routes(routes.Municipality == "NEW BRUNSWICK",:);
ids = new_brunswick.StopID_StopNum;
nb_stops = stops(ismember(stops.stop_code, ids), :);

% write file as json
file = fopen("stops.json","w");
fprintf(file,"%s",jsonencode(nb_stops));
fclose(file);
