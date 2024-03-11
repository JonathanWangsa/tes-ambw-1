var install = document.querySelector('#install-button');
var createPostArea = document.querySelector('#create-post');
var closeCreatePostModalButton = document.querySelector('#close-create-post-modal-btn');
var sharedMomentsArea = document.querySelector('#card');

install.addEventListener('click', openCreatePostModal);

function openCreatePostModal() {
  // createPostArea.style.display = 'block';
  if (deferredPrompt) {
    deferredPrompt.prompt();

    deferredPrompt.userChoice.then(function(choiceResult) {
      console.log(choiceResult.outcome);

      if (choiceResult.outcome === 'dismissed') {
        console.log('User cancelled installation');
      } else {
        console.log('User added to home screen');
      }
    });

    deferredPrompt = null;
  }

  // if ('serviceWorker' in navigator) {
  //   navigator.serviceWorker.getRegistrations()
  //     .then(function(registrations) {
  //       for (var i = 0; i < registrations.length; i++) {
  //         registrations[i].unregister();
  //       }
  //     })
  // }
}

function closeCreatePostModal() {
  createPostArea.style.display = 'none';
}

// shareImageButton.addEventListener('click', openCreatePostModal);

// closeCreatePostModalButton.addEventListener('click', closeCreatePostModal);

// Currently not in use, allows to save assets in cache on demand otherwise
function onSaveButtonClicked(event) {
  console.log('clicked');
  if ('caches' in window) {
    caches.open('user-requested')
      .then(function(cache) {
        cache.add('https://httpbin.org/get');
        cache.add('/src/images/sf-boat.jpg');
      });
  }
}

function clearCards() {
  while(sharedMomentsArea.hasChildNodes()) {
    sharedMomentsArea.removeChild(sharedMomentsArea.lastChild);
  }
}

function createCard(data) {
const card = document.createElement('div');
// card.className.add('col-xs-3', 'col-sm-4');
card.classList.add('card', 'mx-4', 'my-4', 'rounded', 'overflow-hidden', 'border-2', 'shadow-lg', 'align-items-center');
card.style.background = '#ffffff'; // Gradient background
card.style.color = '#000000'; // Text color
card.style.border = '4px solid #ffffff';

// Create image element
const cardImage = document.createElement('img');
cardImage.classList.add('card-img-top', 'img-fluid', 'rounded-top', 'transition'); // Added 'transition' for smoother transitions
cardImage.src = data.gambar;
cardImage.alt = 'Card Image';
cardImage.style.width = '300px'; // Set the desired width
cardImage.style.height = '200px'; // Set the desired height
cardImage.style.center = '200px'; // Set the desired height
card.appendChild(cardImage);

// Create card body
const cardBody = document.createElement('div');
cardBody.classList.add('card-body', 'text-center');

// Create card title
const cardTitle = document.createElement('h5');
cardTitle.classList.add('card-title', 'mb-3', 'fw-bold');
cardTitle.textContent = data.nama;
cardTitle.style.fontFamily = 'Optima';
cardBody.appendChild(cardTitle);

// Create card text
const cardText = document.createElement('p');
cardText.classList.add('card-text', 'text-muted');
cardText.textContent = data.kategori;
cardBody.appendChild(cardText);
cardTitle.style.fontFamily = 'Times New Roman';

// Create button
const cardButton = document.createElement('button');
cardButton.classList.add('btn', 'btn-primary', 'text-light', 'mb-3', 'mt-auto', 'transition','rounded-pill', 'py-2', 'px-4', 'text-uppercase', 'fw-bold', 'border-0', 'gradient-bg');
cardButton.textContent = 'Go Detail';
cardButton.style.background = '#000000'; // Gradient background
cardBody.appendChild(cardButton);

card.appendChild(cardBody);

// Add hover effect
card.addEventListener('mouseenter', function() {
    card.style.transform = 'scale(1.05)'; // Scale up on hover
    cardImage.style.filter = 'brightness(80%)'; // Dim the image
});

card.addEventListener('mouseleave', function() {
    card.style.transform = 'scale(1)'; // Reset scale on mouse leave
    cardImage.style.filter = 'brightness(100%)'; // Reset image brightness
});

card.addEventListener('click', function() {
    goToDetail(data);
});

  componentHandler.upgradeElement(card);
  sharedMomentsArea.appendChild(card);
}

function goToDetail(data){
  var url = "https://tes1ambw-d1d17-default-rtdb.asia-southeast1.firebasedatabase.app/tesambw/" + data.id + ".json";
  // const url = `https://tes1ambw-d1d17-default-rtdb.asia-southeast1.firebasedatabase.app/tesambw/${data.id}.json`;
  // Session
  if (!sessionStorage.getItem(data.id)) {
    fetch(url)
      .then((response) => response.json())
      .then((data_kartu) => {
        sessionStorage.setItem(data.id, JSON.stringify(data_kartu));
        sessionStorage.setItem("clicked", JSON.stringify(data_kartu));
        window.location.href = "/detailCard.html";
      })
      .catch((err) => {
        // alert("Offline from cardClicked");
        window.location.href = "/offline.html";
      });
  } else {
    sessionStorage.setItem("clicked", JSON.stringify(data));
    window.location.href = "/detailCard.html";
  }
  // try {
  //   const response = await fetch(url);
  //   const cardDetail = await response.json();
    
  //   // Store data only if not already present
  //   if (!localStorage.getItem(data.id)) {
  //     localStorage.setItem(data.id, JSON.stringify(cardDetail));
  //   }
    
  //   localStorage.setItem('now', JSON.stringify(data));
  //   window.location.href = "/detail.html";
  // } catch (error) {
  //   if(!localStorage.getItem(data.id)){
  //     console.error('Error fetching data:', error);
  //     window.location.href = "/offline.html";
  //   }
  //   else{
  //     localStorage.setItem('now', JSON.stringify(data));
  //     window.location.href = "/detail.html";
  //   }
  // }
}

function updateUI(data) {
  clearCards();
  for (var i = 0; i < data.length; i++) {
    createCard(data[i]);
  }
}

var url = 'https://tes1ambw-d1d17-default-rtdb.asia-southeast1.firebasedatabase.app/tesambw.json';
var networkDataReceived = false;

fetch(url)
  .then(function(res) {
    return res.json();
  })
  .then(function(data) {
    networkDataReceived = true;
    console.log('From web', data);
    var dataArray = [];
    for (var key in data) {
      dataArray.push(data[key]);
    }
    updateUI(dataArray);
  });

if ('indexedDB' in window) {
  readAllData('posts')
    .then(function(data) {
      if (!networkDataReceived) {
        console.log('From cache', data);
        updateUI(data);
      }
    });
}
