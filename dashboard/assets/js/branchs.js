allBranchs()

function allBranchs(){

    var branchs = []

    db.collection("branchs_list").get().then((snapshot) => {

    branchs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

         
      $("#listBranch").html(
        branchs.map((branch,i) => {

            return `<div class='option' id="option${i}">${branch.name}</div>`

        }).join(""))
        dropdown()
    })

}
function dropdown(){

function toggleClass(elem,className){
    if (elem.className.indexOf(className) !== -1){
      elem.className = elem.className.replace(className,'');
    }
    else{
      elem.className = elem.className.replace(/\s+/g,' ') + 	' ' + className;
    }
  
    return elem;
  }
  
 
  function toggleMenuDisplay(e){
    const dropdown = e.currentTarget.parentNode;
    const menu = dropdown.querySelector('.menu');
    const icon = dropdown.querySelector('.fa-angle-right');
  
    toggleClass(menu,'hide');
    toggleClass(icon,'rotate-90');
  }
  
  function handleOptionSelected(e){
    toggleClass(e.target.parentNode, 'hide');			
  
    const id = e.target.id;
    const newValue = e.target.textContent + ' ';
    const titleElem = document.querySelector('.dropdown .title');
    const icon = document.querySelector('.dropdown .title .fa');
  
  
    titleElem.textContent = newValue;
    titleElem.appendChild(icon);
  
    //trigger custom event
    document.querySelector('.dropdown .title').dispatchEvent(new Event('change'));
      //setTimeout is used so transition is properly shown
    setTimeout(() => toggleClass(icon,'rotate-90',0));
  }
  
  
  
  //get elements
  const dropdownTitle = document.querySelector('.dropdown .title');
  const dropdownOptions = document.querySelectorAll('.dropdown .option');
  
  //bind listeners to these elements
  dropdownTitle.addEventListener('click', toggleMenuDisplay);
  
  dropdownOptions.forEach(option => option.addEventListener('click',handleOptionSelected));
  

}