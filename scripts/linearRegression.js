"use strict";

function linearRegression(x, y){
    
//    console.log("=============================");
//    console.log("Calculating Linear Regression");
    
    var n = x.length;
    for(var i = 0; i < n; i++){
        //console.log(x[i]+" , "+y[i]);
    }
    
    var x_sum = 0.0, y_sum = 0.0, x2_sum = 0.0, xy_sum = 0.0, slope, intercept;
    for(var i = 0; i < n; i++){
        x_sum += x[i];
        y_sum += y[i];
        x2_sum += Math.pow(x[i],2);
        xy_sum += x[i] * y[i];
    }
    
    slope = (n * xy_sum - x_sum * y_sum)/(n * x2_sum - Math.pow(x_sum, 2));
    intercept = (y_sum - slope * x_sum)/n;

//    console.log("Slope: " + slope);
//    console.log("Intercept: " + intercept);
//    console.log("=============================");

    return slope;
    
}