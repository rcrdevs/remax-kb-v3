document.getElementById('searchBox').addEventListener('keyup', function(event) {
  if (event.keyCode === 13) {
    event.preventDefault();
    document.getElementById('searchButton').click();
  }
});

document.getElementById('searchButton').addEventListener('click', function() {
  var input, filter, categories, category, a, i, txtValue;
  input = document.getElementById('searchBox');
  filter = input.value.toUpperCase();
  categories = document.getElementsByClassName('categories');
  
  if (!filter) {
    Array.from(categories).forEach((category) => {
      let links = category.getElementsByTagName('a');
      Array.from(links).forEach((link) => {
        link.style.display = "";
      });
    });
    return;
  }
  
  Array.from(categories).forEach((category, i) => {
    let links = category.getElementsByTagName('a');
    Array.from(links).forEach((link, j) => {
      txtValue = link.textContent || link.innerText;
      fetch(link.href)
        .then(response => response.text())
        .then(html => {
          var parser = new DOMParser();
          var doc = parser.parseFromString(html, 'text/html');
          var pageText = doc.documentElement.textContent;
          if (txtValue.toUpperCase().includes(filter) || pageText.toUpperCase().includes(filter)) {
            link.style.display = "";
          } else {
            link.style.display = "none";
          }
        })
        .catch(error => {
          console.error('Erro ao obter conteúdo da página:', error);
        });
    });
  });
});