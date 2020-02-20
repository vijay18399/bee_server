var res='bg';
switch (res) {
  case 'ar':
    result = {
    language : "Arabic",
    languages:[
    {
       name : "English" ,
       model:"ar-en"
    }
    ]};
    break;
  case 'bg':
    result = {
        language : "Bulgarian",
        languages:[
        {
           name : "English" ,
           model:"ar-en"
        }
        ]};
    break;

}
console.log(result);