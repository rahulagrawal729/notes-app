// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyCu8Z3Hg1yPH9t2JDMr34Osqrp1AD0KHeA",
    authDomain: "notes-app-f827b.firebaseapp.com",
    projectId: "notes-app-f827b",
    storageBucket: "notes-app-f827b.appspot.com",
    messagingSenderId: "704654939957",
    appId: "1:704654939957:web:c8aef89d1fc3494b6c5e7c"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

console.log('Welcome to Notes-App');

var MyNoteApp = MyNoteApp || {};
MyNoteApp = function () {
    var notesss = "myNotes",
        allNotesId = '#notes',
        dvNotesId = '#notes div',
        dvNoteDetailsId = '#note-details',
        btnDeleteId = '#btn-delete';
        
    var init = function (args) {
        MyNoteApp._args = args;
        loadNotes();

        bindAddNotes();
        bindColorOptionChange();
        bindDeleteNote();
        bindNoteClick();
        bindNoteReset();
        bindDvMouseUp();
        bindAutoSave();
    }
    var loadNotes = function (callback) {
        var notesArr = getNotesFromLocalStorage();
        if (notesArr.length > 0) {
            displayNotesList(notesArr);
            if (notesArr.length > 0) {
                var thisDv = $(dvNotesId)[0];
                displaySelectedNote(thisDv);
            }
        }
        else
            addNewNote();

        setTimeout(function () { setFocusToEditNote(); }, 500);
    }
    var bindAddNotes = function () {
        $('#add-note').on('click', function (e) {
            e.preventDefault();
            addNewNote();
        });
    }
    var bindColorOptionChange = function () {
        $('input[name="colorOption"]').on('change', function (e) {
            setSelectedListColor(e);
        });
    }
    var bindDeleteNote = function () {
        $(document).on('click', btnDeleteId, function (e) {
            e.preventDefault();
            thisElem = e.target;
            var noteId = $(thisElem).attr("data-selectednoteid");
            if (noteId) { deleteNote(noteId); }
            else alert("All notes have been deleted!");
        });
    }
    var bindNoteClick = function () {
        $(document).on('click', 'div#detail-title, div#detail-note', function (e) {
            e.preventDefault();
            divToTextarea(e);
        });
    }
    var bindNoteReset = function () {
        $(document).on('blur', 'textarea#detail-title, textarea#detail-note', function (e) {
            e.preventDefault();
            resetToDiv(e);
        });
    }
    var bindDvMouseUp = function () {
        $(document).on('mouseup', dvNotesId, function (e) {
            e.preventDefault();
            displaySelectedNote(this);
        });
    }
    var bindAutoSave = function () {
        var timer;
        $(document).on('input change', 'textarea#detail-title, textarea#detail-note', function (e) {
            var thisElem = this;
            if (timer) clearTimeout(timer);
            timer = setTimeout(function () {
                updateNotes(thisElem,);
            }, 100);
        });
    }

    var setActivePara = function (thisPara) {
        $(dvNotesId).removeClass('activePara');
        $(thisPara).addClass('activePara');
    }
    var getNotesFromLocalStorage = function () {
        if (typeof (Storage) !== "undefined") {
            var storedNotes = localStorage.getItem(notesss);
            if (storedNotes) {
                var notesArr = JSON.parse(storedNotes);
                return notesArr;
            }
            else {
                return [];
            }
        } 
    }
    var displayNotesList = function (notesArr) {
        var count = notesArr.length;
        if (count > 0) {
            for (var i = 0; i < count; i++) {
                var currNote = notesArr[i];

                var note = document.createElement("div");
                note.setAttribute("id", "note-" + i);
                note.setAttribute("class", currNote.CssClass );

                var div_title = document.createElement("p");
                div_title.setAttribute("class", "title");
                div_title.innerHTML = currNote.Title

                var div_note = document.createElement("p");
                div_note.setAttribute("class", "short-note");
                div_note.innerHTML = currNote.Content;

                var date=document.createElement("p");
                date.setAttribute("class", "dateNote");
                date.innerHTML="<i>Last edited on:</i>"+currNote.tillDate;
                

                note.appendChild(div_title);
                note.appendChild(div_note);
                notes.appendChild(note);
                note.appendChild(date);
            }
        }
    }
    var displaySelectedNote = function (selectedNote) {
        var listPara = $(selectedNote).find('p');
        if (listPara) {
            var selectedNoteId = $(selectedNote)[0].id;
            var noteDetails = document.getElementById('note-details');
            noteDetails.setAttribute('data-selectedNoteId', selectedNoteId);
            $(noteDetails).html('');

            var btnDelete = document.getElementById('btn-delete');
            btnDelete.setAttribute('data-selectedNoteId', selectedNoteId);

            var detailTitleDiv = document.createElement('div');
            detailTitleDiv.setAttribute('id', 'detail-title');
            detailTitleDiv.setAttribute('class', 'bottom-border');
            detailTitleDiv.innerHTML = listPara[0].innerHTML;

            var detailNoteDiv = document.createElement('div');
            detailNoteDiv.setAttribute("id", 'detail-note');
            detailNoteDiv.innerHTML = listPara[1].innerHTML;

            noteDetails.appendChild(detailTitleDiv);
            noteDetails.appendChild(detailNoteDiv);

            var noteColor = $(selectedNote)[0].className;
            setSelectedColorBttn(noteColor);
            setFocusToEditNote();
            setActivePara($(selectedNote)[0]);
        }
    }
    var addNote = function (cssClass, noteTitle, noteContent, dateAndTime) {
        var noteArr = getNotesFromLocalStorage();
        noteArr.unshift({ CssClass: cssClass, Title: noteTitle, Content: noteContent, tillDate:dateAndTime });
        return noteArr;
    }
    var setNotesInLocalStorage = function (notesArr) {
        localStorage.removeItem(notesss);
        var jsonStr = JSON.stringify(notesArr);
        localStorage.setItem(notesss, jsonStr);
    }
    var addNewNote = function () {
        var noteArr = addNote("green", "", "",new Date().toLocaleString());
        setNotesInLocalStorage(noteArr);
        refreshAll(noteArr);
    }
    var setSelectedListColor = function (e) {
        var selectedNoteId = $(dvNoteDetailsId).data("selectednoteid");
        var noteListItem = $(allNotesId).find('#' + selectedNoteId);
        $(noteListItem[0]).removeClass();
        var selectedColor = getSelectedRadioutton().value;
        $(noteListItem[0]).addClass(selectedColor);
        updateNotes(e.target,);
    }
    var setSelectedColorBttn = function (noteCssClass) {
        var radioGroup = $('input[name="colorOption"]');
        $('input[name="colorOption"]:checked').removeAttr('checked');

        for (var i = 0; i < radioGroup.length; i++) {
            var thisClassName = $(radioGroup[i]).val();
            if (noteCssClass.indexOf(thisClassName) > -1) {
                radioGroup[i].setAttribute("checked", "checked");
                return; 
            }
        }
    }
    var getSelectedRadioutton = function () {
        return $('input[name="colorOption"]:checked')[0];
    }
    var deleteNote = function (noteId) {
        let confirmDelete=confirm("Are you sure you want to delete this note? This can't be restored.")
        if(confirmDelete==true){
        var noteIdx = getIndexFromNoteId(noteId);
        var noteArr = getNotesFromLocalStorage();
        if (noteArr.length > 0) {
            noteArr.splice(noteIdx, 1);

            setNotesInLocalStorage(noteArr);
            if (noteArr.length == 0) {
                addNewNote();
                return;
            }
            refreshAll(noteArr);
        }
    }
}
    var divToTextarea = function (e) {
        var thisElem = e.target;
        var dvHtml = $(thisElem).html();
        var editableTextArea = document.createElement('textarea');
        editableTextArea.setAttribute('placeholder', 'Enter your text here');
        editableTextArea.setAttribute('id', $(thisElem)[0].id);
        $(editableTextArea).val(dvHtml);
        $(thisElem).replaceWith(editableTextArea);
        $(editableTextArea).focus();
    }
    var resetToDiv = function (e) {
        var thisElem = e.target;
        var html = $(thisElem).val();
        var dv = document.createElement('div');
        dv.setAttribute('id', $(thisElem)[0].id);
        $(dv).html(html);
        $(thisElem).replaceWith(dv);
    }
    var setFocusToEditNote = function () {
        document.getElementById('detail-title').click();
    }
    var updateNotes = function (elem) {
        thisElem = elem.id;
        var isElemTitle = (thisElem == 'detail-title' && $('#' + thisElem).is("textarea"));
        var isElemNote = (thisElem == 'detail-note' && $('#' + thisElem).is("textarea"));
        
        var noteId = $(dvNoteDetailsId).attr('data-selectednoteid');
        var noteIdx = getIndexFromNoteId(noteId);
        var noteArr = getNotesFromLocalStorage();
        if (noteArr) {
            var cssClass = getSelectedRadioutton().value,
                noteTitle = isElemTitle ? $('#detail-title')[0].value : $('#detail-title').html(),
                noteContent = isElemNote ? $('#detail-note')[0].value : $('#detail-note').html(),
                updateDivId = $(dvNoteDetailsId).attr('data-selectednoteid');

            var note = { CssClass: cssClass, Title: noteTitle, Content: noteContent, tillDate: new Date().toLocaleString() };
            noteArr[noteIdx] = note;

            setNotesInLocalStorage(noteArr);
            refreshNotes(noteArr);

            setActivePara($('div#' + noteId)[0]);
        }
    }
    var refreshNotes = function (notesArr) {
        $(allNotesId).empty();
        displayNotesList(notesArr);
    }
    var refreshAll = function (notesArr) {
        $(allNotesId).empty();
        displayNotesList(notesArr);

        displaySelectedNote($(dvNotesId)[0]);
    }
    var getIndexFromNoteId = function (noteId) {
        var idx = noteId.indexOf('-');
        if (idx > 0)
            return noteId.substring(idx + 1);
    }

    return {
        init: init
    }
}();

function enter() { location.replace("login.html") }
function signOut() {
    auth.signOut();
    alert("SignedOut");
    enter();
}


let search=document.getElementById("search");
search.addEventListener("input", function(){

let inputVal=search.value;

     let notecards=document.querySelectorAll(".blue");
     Array.from(notecards).forEach(function(element){
        let cardTxt=element.getElementsByTagName("p")[0].innerText;
        let cardTxt2=element.getElementsByTagName("p")[1].innerText;

        if(cardTxt.includes(inputVal)){
            element.style.display="block";
        }
            else if(cardTxt2.includes(inputVal)){
                element.style.display="block";
            }
        
        else{
            element.style.display="none";
        }
    });

        let notecards1=document.querySelectorAll(".green");
     Array.from(notecards1).forEach(function(element){
        let cardTxt=element.getElementsByTagName("p")[0].innerText;
        let cardTxt2=element.getElementsByTagName("p")[1].innerText;

        if(cardTxt.includes(inputVal)){
            element.style.display="block";
        }
            else if(cardTxt2.includes(inputVal)){
                element.style.display="block";
            }
        
        else{
            element.style.display="none";
        }
    });


    let notecards2=document.querySelectorAll(".red");
    Array.from(notecards2).forEach(function(element){
       let cardTxt=element.getElementsByTagName("p")[0].innerText;
       let cardTxt2=element.getElementsByTagName("p")[1].innerText;

       if(cardTxt.includes(inputVal)){
           element.style.display="block";
       }
           else if(cardTxt2.includes(inputVal)){
               element.style.display="block";
           }
       
       else{
           element.style.display="none";
       }
   });


   let notecards3=document.querySelectorAll(".yellow");
   Array.from(notecards3).forEach(function(element){
      let cardTxt=element.getElementsByTagName("p")[0].innerText;
      let cardTxt2=element.getElementsByTagName("p")[1].innerText;

      if(cardTxt.includes(inputVal)){
          element.style.display="block";
      }
          else if(cardTxt2.includes(inputVal)){
              element.style.display="block";
          }
      
      else{
          element.style.display="none";
      }
  });



    })
    function darkmode(){
        var element=document.body;
        element.classList.toggle("dark-mode");
    }



    window.onload = MyNoteApp.init();