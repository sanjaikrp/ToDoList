module.exports=getdate;

function getdate(){
    let today=new Date();
    let currentDay=today.getDay();
    
    var options={
        weekday:"long",
        day:"numeric",
        month:"long"
    };
    
    let day=today.toLocaleDateString("en-IN",options);  
    return day;
}
