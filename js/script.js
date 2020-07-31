
let booksList = document.querySelector('.books');
let toMain = document.querySelector('#logo') 
let toFav = document.querySelector('#toFav');
let toTop = document.querySelector('#toTop'); 
let toGenres = document.querySelector('#toGenres'); 
let state = [];

let favArray;

if(localStorage.getItem("favoriteBooks") != null){
	favArray = JSON.parse(localStorage.getItem("favoriteBooks"))
} else{
	localStorage.setItem("favoriteBooks", [])
	favArray = []
}
 




// Getting books from api
const getState = async () => {
	let response = await fetch('https://demo7290492.mockable.io/');
	if(response.ok){
		return await response.json();  
	} else {
		console.error(response.status);
	}
}  




// Rendering book 
const createBook = (data) => {
	booksList.style.gridTemplateColumns = 'repeat(4, 1fr)';
	booksList.innerHTML = ''; 
 
	data.forEach(item => {
		let bookDiv = document.createElement('div');
		bookDiv.className = 'bookWrapper'; 
		booksList.appendChild(bookDiv)  
		const book = `
			<div class="book" data-id="${ item.id }" > 
				<div class="book__img">
					<img src='img/books/${ item.id }.jpg' alt='book'/>
				</div>
				<p class="book__name">${ item.name }</p> 
				<button class="book__fav" data-toFav="${ item.id }">${ favArray.some(fav => fav.id === item.id) ? 'Unfavorite' : 'Favorite' }</button>	
			</div>`;
 
		bookDiv.innerHTML = book; 
		let btn = bookDiv.querySelector('.book__fav');
		bookDiv.addEventListener('click', (e) => {
			if(e.target !== btn){
				createModals(item.id)
			} 
		})
	}) 
	favFunction()
} 




// Create Modal windows for book on Click
const createModals = (bookId) => { 
	let modalBlock = document.querySelector('.modalWindow');
	modalBlock.innerHTML = ''
	modalBlock.style.display = 'flex'
	document.body.style.overflow = 'hidden'
	state.forEach(item => {
		if(item.id == bookId){ 
			let bookDiv = document.createElement('div');
			bookDiv.className = 'bookModalWrapper'; 
			const book = `
				<div class="bookModal" data-id=${ item.id } > 
					<div class="bookModal__img">
						<img src='img/books/${ item.id }.jpg' alt='book'/>
					</div>
					<div class="bookModal__descr"> 
						<p class="bookModal__name">Название: ${ item.name }</p> 
						<p class="bookModal__author">Автор: ${ item.author }</p> 
						<p class="bookModal__shortDescr">${ item.shortDescr }</p> 
						<p class="bookModal__about">${ item.about }</p> 
					</div>
					<div class="buttons">
						<a href="${item.linkForBrief}" class="bookModal__linkToBrief">Читать конспект</a>
					</div>
				</div>`;
 
			bookDiv.innerHTML = book; 
			modalBlock.appendChild(bookDiv)  
		}
	}) 
 
    modalBlock.addEventListener('click', (e) => {
    	console.log(e);
        if(e.target === modalBlock){ 
            document.body.style.marginRight = `0px`;
            modalBlock.style.display = 'none';
            document.body.style.overflow = ''; 
        }
    }) 
} 




// Top 10 books
const top10Books = (data) => {
	booksList.style.gridTemplateColumns = 'repeat(1, 1fr)';
	booksList.innerHTML = ''; 

	[...data].sort((a, b) => b.rating - a.rating)
		.forEach((item, i) => { 
			if(i < 5){
				let bookDiv = document.createElement('div');
				bookDiv.className = 'bookWrapper'; 
				booksList.appendChild(bookDiv) 
				const book = ` 
					<div class="topBook" data-id="${ item.id }">
						<div class="topBook__img">
							<img src='img/books/${ item.id }.jpg' alt='book'/>
						</div>
						<div class="topBook__text"> 
							<p class="topBook__name">${ item.name }</p>  
							<p class="topBook__author">${ item.author }</p>
							<p class="topBook__descr">${ item.shortDescr }</p>
							<p class="topBook__rating">Rating: ${ item.rating }</p>
							<button class="topBook__fav" data-toFav="${ item.id }">${ favArray.some(fav => fav.id === item.id) ? 'Unfavorite' : 'Favorite' }</button>
						</div>
					</div>`;

				bookDiv.innerHTML = book;  
				let btn = bookDiv.querySelector('.topBook__fav');
				bookDiv.addEventListener('click', (e) => {
					if(e.target !== btn){
						createModals(item.id)
					} 
				})
			}
	}) 
}




// Favorite books
const favoriteBooks = (favorites) => {
	booksList.style.gridTemplateColumns = 'repeat(1, 1fr)';
	booksList.innerHTML = ''; 
 	if(favorites.length) {
	 	favorites.forEach(item => { 
			let bookDiv = document.createElement('div');
			bookDiv.className = 'bookWrapper'; 
			booksList.appendChild(bookDiv) 
			const book = ` 
				<div class="favBook" data-id="${ item.id }">
					<div class="favBook__img">
						<img src='img/books/${ item.id }.jpg' alt='book'/>
					</div>
					<div class="topBook__text"> 
						<p class="favBook__name">${ item.name }</p> 
						<p class="favBook__author">${ item.author }</p>
						<p class="favBook__descr">${ item.shortDescr }</p>
						<p class="favBook__rating">Rating: ${ item.rating }</p>
						<button class="topBook__fav" data-toFav="${ item.id }">${ favArray.some(fav => fav.id === item.id) ? 'Unfavorite' : 'Favorite' }</button>
					</div>
				</div>`;

			bookDiv.innerHTML = book;
			let btn = bookDiv.querySelector('.favBook__fav');
			bookDiv.addEventListener('click', (e) => {
				if(e.target !== btn){
					createModals(item.id)
				} 
			})  
		})
	} else{
		booksList.innerHTML = 'Список пуст(('; 
	}
}




// Adding to favorites
const favFunction = () => {
	document.querySelectorAll('button[data-toFav]').forEach(button => {
		button.addEventListener('click', () => {
			let id = button.getAttribute('data-toFav') 
			if(favArray.length){
				if (!favArray.some(item => item.id === +id)) { 
					let newFavBook = state.filter(item => item.id === +id)
					favArray.push(...newFavBook)
					button.textContent = 'Unfavorite'; 
		        } else {  
		        	favArray = favArray.filter(item => item.id !== +id)
					button.textContent = 'Favorite'; 
		        }      
			} else{
				let newFavBook = state.filter(item => item.id === +id)
				favArray.push(...newFavBook)
				button.textContent = 'Unfavorite';
			}
		localStorage.setItem('favoriteBooks', JSON.stringify(favArray))
		console.log(favArray);
		})
	});
}




// Filter searching books
const searchFunc = (name) => { 	
	let searchedBooks = state.filter(item => item.name.toLowerCase().search(name.toLowerCase()) !== -1)
	createBook(searchedBooks)
}
// EventListener for seacrh input
let searchInput = document.querySelector('#search');
searchInput.addEventListener('input', (e) => {
	searchFunc(e.target.value)
})




getState().then(data => { 
	state = [...data] 
	createBook(data); 

	toMain.addEventListener('click', (e) => {
		e.preventDefault(); 
		createBook(data);
	});

	toTop.addEventListener('click', (e) => {
		e.preventDefault(); 
		top10Books(data);
	});


	toFav.addEventListener('click', (e) => {  
		favoriteBooks(favArray)
	}); 
}) 