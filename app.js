class App {
    constructor(selectors) {
        this.dinos =[]
        this.max = 0
        this.list = document
            .querySelector(selectors.listSelector)
        this.template = document
            .querySelector(selectors.templateSelector)
        document
            .querySelector(selectors.formSelector)
            .addEventListener('submit', this.addDinoFromForm.bind(this))

        //focus in on an input box
        //document.querySelector(selectors.formSelector).dinoName.focus()
        
        this.load()
//html5 way is adding autofocus in html as an attribute //required can be placed in html to require something in the input

    }

    load () {
        //load the JSON from localStorage
        const dinoJSON = localStorage.getItem('dinos')
        //convert the JSCON back into an array
        const dinoArray = JSON.parse(dinoJSON)
        //set this.dinos with the dinos from that array
        if (dinoArray) {
            dinoArray
                .reverse()
                .map(this.addDino.bind(this))
        }
    }

    addDino(dino) {
        const listItem = this.renderListItem(dino)
        this.list.insertBefore(listItem, this.list.firstChild)

        this.dinos.unshift(dino)
        this.save()

        if (dino.id > this.max) {
            this.max = dino.id
        }
    }

    addDinoFromForm(ev) {//rename of addDino
        ev.preventDefault()

        const dino = {//this creates an object with a name property, and id property
            id: this.max + 1,
            name: ev.target.dinoName.value,
            fav: false,
            diet: ev.target.diet.value,
        }
        
        this.addDino(dino)
        ev.target.reset()
    }

    save() {
        localStorage
            .setItem('dinos', JSON.stringify(this.dinos))
    }

    renderListItem(dino) {
        const item = this.template.cloneNode(true)
        item.classList.remove('template')
        item.dataset.id = dino.id

        if (dino.fav) {
            item.classList.add('fav')
        }

        if (dino.diet) {
            item
                .querySelector('.dino-diet')
                .textContent = dino.diet
        }

        item
            .querySelector('.dino-name')
            .textContent = dino.name
        
        item
            .querySelector('.dino-name')
            .setAttribute('title', dino.name)

        item
            .querySelector('.dino-name')
            .addEventListener('keypress', this.saveOnEnter.bind(this, dino))
        
        item
            .querySelector('.dino-diet')
            .addEventListener('keypress', this.saveOnEnter.bind(this, dino))

        item
            .querySelector('button.remove')
            .addEventListener('click', this.removeDino.bind(this))
        item
            .querySelector('button.fav')
            .addEventListener('click', this.favDino.bind(this, dino))
        item
            .querySelector('button.move-up')
            .addEventListener('click', this.moveUp.bind(this, dino))
        item
            .querySelector('button.move-down')
            .addEventListener('click', this.moveDown.bind(this, dino))
        item
            .querySelector('button.edit')
            .addEventListener('click', this.editDino.bind(this, dino))

        return item
    }

    saveOnEnter(dino, ev) {
    if (ev.key === 'Enter') {
      this.editDino(dino, ev)
    }
  }

  editDino(dino, ev) {
    const listItem = ev.target.closest('.dino')
    const nameField = listItem.querySelector('.dino-name')
    const dietField = listItem.querySelector('.dino-diet')

    const btn = listItem.querySelector('.edit.button')
    const icon = btn.querySelector('i.fa')

    if (nameField.isContentEditable) {
      // make it no longer editable
      nameField.contentEditable = false
      dietField.contentEditable = false
      icon.classList.remove('fa-check')
      icon.classList.add('fa-pencil')
      btn.classList.remove('success')

      // save changes
      dino.name = nameField.textContent
      dino.diet = dietField.textContent
      this.save()
    } else {
      nameField.contentEditable = true
      dietField.contentEditable = true
      nameField.focus()
      icon.classList.remove('fa-pencil')
      icon.classList.add('fa-check')
      btn.classList.add('success')
    }
  }

  moveDown(dino, ev) {
    const listItem = ev.target.closest('.dino')

    const index = this.dinos.findIndex((currentDino, i) => {
      return currentDino.id === dino.id
    })

    if (index < this.dinos.length - 1) {
      this.list.insertBefore(listItem.nextElementSibling, listItem)

      const nextDino = this.dinos[index + 1]
      this.dinos[index + 1] = dino
      this.dinos[index] = nextDino
      this.save()
    }
  }

  moveUp(dino, ev) {
    const listItem = ev.target.closest('.dino')

    const index = this.dinos.findIndex((currentDino, i) => {
      return currentDino.id === dino.id
    })

    if (index > 0) {
      this.list.insertBefore(listItem, listItem.previousElementSibling)

      const previousDino = this.dinos[index - 1]
      this.dinos[index - 1] = dino
      this.dinos[index] = previousDino
      this.save()
    }
  }
    
    favDino(dino, ev) {

       const listItem = ev.target.closest('.dino')
       
       dino.fav = !dino.fav
       if (dino.fav) {
           listItem.classList.add('fav')
       } else {
           listItem.classList.remove('fav')
       }


       this.save()

    }

    removeDino(ev) {
        const listItem = ev.target.closest('.dino')
        listItem.remove()

        for (let i = 0; i < this.dinos.length; i++) {
            const currentId = this.dinos[i].id.toString()
            if (listItem.dataset.id === currentId) {
                this.dinos.splice(i, 1)
                break;
            } 
        }
        this.save()
    }
}

const app = new App({
    formSelector: '#dino-form',
    listSelector: '#dino-list',
    templateSelector: '.dino.template',
})

//notes and removed code
//this.dinos.splice(?, 1)
//console.log('remove')

//console.log('found it')

//closest is not latest in support

//console.log(dino.name, dino.id)
        
//const listItem = this.renderListItem(dino)
//this.list.appendChild(listItem)
//this.list.prepend(listItem) //not widely supported let's use a more supported way
//this.list.insertBefore(listItem, this.list.firstChild)
//this.dinos.push(dino)//pushes dino to the array to the end

//adding to the beginning of the array
//unshift
//this.dinos.unshift(dino)
//this.save()
//localStorage.setItem('dinos', JSON.stringify(this.dinos))

//const dinoName = ev.target.dinoName.value

 //adding to the beginning of the array
//this.dinos.push(dino)//pushes dino to the array to the end
//unshift

//this.list.appendChild(listItem)
//this.list.prepend(listItem) //not widely supported let's use a more supported way
