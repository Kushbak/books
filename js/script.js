
let booksList = document.querySelector('.books');
let toMain = document.querySelector('#logo') 
let toFav = document.querySelector('#toFav');
let toTop = document.querySelector('#toTop'); 
let toGenres = document.querySelector('#toGenres'); 
let state = [];

let favArray = JSON.parse(localStorage.getItem("favorite")) || [];


const getState = async () => {
	let response = await fetch('http://demo7290492.mockable.io/');
	if(response.ok){
		return await response.json();  
	} else {
		console.error(response.status);
	}
}   
 

const createBook = (data) => {
	booksList.style.gridTemplateColumns = 'repeat(4, 1fr)';
	booksList.innerHTML = ''; 
 
	data.forEach(item => {
		let bookDiv = document.createElement('div');
		bookDiv.className = 'bookWrapper'; 
		booksList.appendChild(bookDiv) 
		const book = `
			<div class="book">
				<a href="#" class="book__link" data-id="${item.id}">
					<div class="book__img"></div>
					<p class="book__name">${item.name}</p>
				</a>
				<button class="book__fav" data-toFav="${item.id}">Favorite</button>	
			</div>`;

		bookDiv.innerHTML = book; 
	})

	favFunction()
} 

// взять getAttribute(href) у а взять id и с ее помощью сделать фильтр на все посты и показать соответстующие этому id 

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
					<div class="topBook">
						<div class="topBook__img">
					
						</div>
						<div class="topBook__text">
							<a href="#" class="book__link" data-id="${item.id}">
								<p class="topBook__name">${item.name}</p>
							</a>
							<p class="topBook__author">${item.author}</p>
							<p class="topBook__descr">${item.shortDescr}</p>
							<p class="topBook__rating">Rating: ${item.rating}</p>
							<button class="topBook__fav" data-toFav="${item.id}">Favorite</button>
						</div>
					</div>`;

				bookDiv.innerHTML = book;  
			}
	})

	favFunction()
}



const favoriteBooks = (data, favorites) => {
	booksList.style.gridTemplateColumns = 'repeat(1, 1fr)';
	booksList.innerHTML = ''; 

	data.forEach(item => {  
		favorites.forEach(fav => {
			if(item.id == fav){
				let bookDiv = document.createElement('div');
				bookDiv.className = 'bookWrapper'; 
				booksList.appendChild(bookDiv) 
				const book = ` 
					<div class="favBook">
						<div class="favBook__img">
					
						</div>
						<div class="topBook__text">
							<a href="#" class="book__link" data-id="${item.id}">
								<p class="favBook__name">${item.name}</p>
							</a>
							<p class="favBook__author">${item.author}</p>
							<p class="favBook__descr">${item.shortDescr}</p>
							<p class="favBook__rating">Rating: ${item.rating}</p>
							<button class="topBook__fav" data-toFav="${item.id}">Favorite</button>
						</div>
					</div>`;

				bookDiv.innerHTML = book;  
			}
		})
	});
	favFunction()
}


const favFunction = () => {
	document.querySelectorAll('button[data-toFav]').forEach(button => {
		button.addEventListener('click', () => {
			let id = button.getAttribute('data-toFav')  
			if(favArray.length){
				favArray.forEach(item => {
					console.log(favArray.indexOf(item));
					if(item == id){
						favArray.splice(favArray.indexOf(item), 1)
						button.textContent = 'Favorite';
					} else{
						favArray.push(id);
						button.textContent = 'Unfavorite';
					}
				})	
			} else{
				favArray.push(id)
				button.textContent = 'Unfavorite';
			}
			
		console.log(JSON.parse(localStorage.getItem("favorite")));
		localStorage.setItem('favorite', JSON.stringify(favArray))
		})
	});
}

 




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
		favoriteBooks(data, favArray)
	});

}) 