$(document).ready(function() {
    
    $("#calculate").click(function() {
        
        var classMap = [];
        
        var totalCredits = 0;
        var count = 0;
        var gpa = 0;
        
        
        $(".credit_hours").each(function(evt) {
            if($(this).val() != "") {
                totalCredits += parseInt($(this).val());
                classMap[count] = parseInt($(this).val());
                
                count++;
            }
        });
        
        if (count >= 2) {
            var numGrade = 0;
            var gradeTimesHour = 0;
            count = 0;
            
            $(".letter_grade").each(function(evt) {
                
                if($(this).val() != "Select") {
                    
                    switch($(this).val()) {
                        case "A":
                            numGrade = 4;
                            break;
                        case "B":
                            numGrade = 3;
                            break;
                        case "C":
                            numGrade = 2;
                            break;
                        case "D":
                            numGrade = 1;
                            break;
                        case "F":
                            numGrade = 0;
                            break;
                        default:
                            alert("Error");
                    }
                    if (classMap.length > count) {
                        gradeTimesHour += (numGrade * classMap[count]);
                        count++;
                    
                        gpa = gradeTimesHour/totalCredits;
                    }
                }
            });
            $("#gpa").text("Your GPA is: " + gpa.toFixed(1));
        } else {
            alert("Please enter at least 2 classes!")
        }
    });
});