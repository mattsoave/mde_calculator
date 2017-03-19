// ¯\_(ツ)_/¯
// Found via www.evanmiller.org/ab-testing/sample-size.html
function ppnd(p) {
    var a0 = 2.50662823884;
    var a1 = -18.61500062529;
    var a2 = 41.39119773534;
    var a3 = -25.44106049637;
    var b1 = -8.47351093090;
    var b2 = 23.08336743743;
    var b3 = -21.06224101826;
    var b4 = 3.13082909833;
    var c0 = -2.78718931138;
    var c1 = -2.29796479134;
    var c2 = 4.85014127135;
    var c3 = 2.32121276858;
    var d1 = 3.54388924762;
    var d2 = 1.63706781897;
    var r;
    var split = 0.42;
    var value;

    /*
       0.08 < P < 0.92
       */
    if ( Math.abs( p - 0.5 ) <= split )
    {
        r = ( p - 0.5 ) * ( p - 0.5 );

        value = ( p - 0.5 ) * ( ( (
                        a3   * r
                        + a2 ) * r
                    + a1 ) * r
                + a0 ) / ( ( ( (
                                b4   * r
                                + b3 ) * r
                            + b2 ) * r
                        + b1 ) * r
                    + 1.0 );
    }
    /*
       P < 0.08 or P > 0.92,
       R = min ( P, 1-P )
       */
    else if ( 0.0 < p && p < 1.0 ) {
        if ( 0.5 < p ) {
            r = Math.sqrt ( - Math.log ( 1.0 - p ) );
        } else {
            r = Math.sqrt ( - Math.log ( p ) );
        }

        value = ( ( (
                        c3   * r
                        + c2 ) * r
                    + c1 ) * r
                + c0 ) / ( (
                        d2   * r
                        + d1 ) * r
                    + 1.0 );

        if ( p < 0.5 )
        {
            value = - value;
        }
    }
    /*
       P <= 0.0 or 1.0 <= P
       */
    else {
        value = NaN;
    }

    return value;
}

function calculateNforMDE(alpha, power_level, baseline, mde, isRelative) {
    if (isRelative) mde *= baseline;
    
    var t_alpha2 = ppnd(1.0-alpha/2);
    var t_beta = ppnd(power_level);

    var sd1 = Math.sqrt(2 * baseline * (1.0 - baseline));
    var sd2 = Math.sqrt(baseline * (1.0 - baseline) + (baseline + mde) * (1.0 - baseline - mde));

    return (t_alpha2 * sd1 + t_beta * sd2) * (t_alpha2 * sd1 + t_beta * sd2) / (mde * mde);
}

function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        if (pair[0] == variable) {
            return pair[1];
        }
    }
    return (false);
}

function calculateMDE(baselineConversionRate, perTreatmentTraffic, alpha = 0.05, power = 0.80) {
    var mdeGuessUpperBound = 0.9999;
    var mdeGuessLowerBound = 0.0001;
    var mdeGuess

    var results = [];
    
    for (var a = 0; a < 50; a++) {
        mdeGuess = (mdeGuessLowerBound + mdeGuessUpperBound) / 2;
        
        let calculatedSampleSize = calculateNforMDE(alpha, power, baselineConversionRate, mdeGuess, true);
        let difference = Math.abs((calculatedSampleSize - perTreatmentTraffic)/perTreatmentTraffic);

        results.push({
            "mdeGuess": mdeGuess,
            "calculatedSampleSize": Math.round(calculatedSampleSize),
            "diff": difference
        });

        if (difference < 0.00001) break;

        if (calculatedSampleSize > perTreatmentTraffic) {
            mdeGuessLowerBound = mdeGuess;
        } else {
            mdeGuessUpperBound = mdeGuess;
        }
    }
    
    
    console.table(results);
    
    return mdeGuess;
}


//
//function calculateNforMDE(baseline, mde, customOptions) {
//    const DEFAULT_OPTIONS = {
//        alpha: 0.05,
//        power: 0.80,
//        relativeMDE: true
//    };
//    
//    var options = Object.assign({}, DEFAULT_OPTIONS, customOptions);
//    console.log(options);
//    
//    if (options.relativeMDE) mde *= baseline;
//    
//    var t_alpha2 = ppnd(1.0-options.alpha/2);
//    var t_beta = ppnd(options.power);
//
//    var sd1 = Math.sqrt(2 * baseline * (1.0 - baseline));
//    var sd2 = Math.sqrt(baseline * (1.0 - baseline) + (baseline + mde) * (1.0 - baseline - mde));
//
//    return (t_alpha2 * sd1 + t_beta * sd2) * (t_alpha2 * sd1 + t_beta * sd2) / (mde * mde);
//}

//$(document).ready(function() {
//    $("#input-submit").on("click", function() {
//        var conversion = parseFloat($("#input-conversion").val());
//        var traffic = parseFloat($("#input-traffic").val())*1000;
//        console.log(traffic);
//        if (conversion !== "" && traffic !== "") {
//            $('#output-mde').html((calculateMDE(0.05, 0.80, conversion/100, traffic)*100).toFixed(2) + "%");
//        }
//    })
//});

document.addEventListener("DOMContentLoaded", function(event) { 
    
    var submitButton = document.getElementById("input-submit"),
        inputs = {
            conversion: document.getElementById("input-conversion"),
            traffic: document.getElementById("input-traffic")
        },
        outputs = {
            mde: document.getElementById("output-mde")
        };
    
    submitButton.addEventListener("click", function() {
        var conversion = parseFloat(inputs.conversion.value)/100,
            traffic = parseFloat(inputs.traffic.value)*1000;
        
        var calculatedMDE = calculateMDE(conversion, traffic, 0.05, 0.80);
        outputs.mde.innerHTML = (calculatedMDE*100).toFixed(2) + "%";
    });
});