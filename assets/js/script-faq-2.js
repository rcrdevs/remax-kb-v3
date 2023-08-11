function extractArticleTitles(doc, pageUrl) {
  const titleElements = doc.querySelectorAll('.question a h3 span');
  const baseUrl = pageUrl.substring(0, pageUrl.lastIndexOf('/') + 1);
  let titles = Array.from(titleElements).map(el => {
    return {
      title: el.textContent.trim(),
      url: baseUrl + el.parentElement.parentElement.getAttribute('href')
    };
  });

  // Filtrar os títulos que contêm "tempo de leitura" e "artigos relacionados"
  titles = titles.filter(titleObj => !titleObj.title.includes("Tempo de leitura"));
  titles = titles.filter(titleObj => !titleObj.title.includes("Artigos relacionados"));

  return titles;
}

function extractH2Titles(doc) {
  const titleElements = doc.querySelectorAll('h2');
  let titles = Array.from(titleElements).map(el => {
    return {
      title: el.textContent.trim()
    };
  });

  // Filtrar os títulos que contêm "tempo de leitura" e "artigos relacionados"
  titles = titles.filter(titleObj => !titleObj.title.includes("Tempo de leitura"));
  titles = titles.filter(titleObj => !titleObj.title.includes("Artigos relacionados"));

  return titles;
}

let addedTitles = new Set();

window.addEventListener('DOMContentLoaded', function () {
  var searchBox = document.getElementById('searchBox');
  var searchButton = document.getElementById('searchButton');
  var resultBox = document.getElementById('search-results');

  var pages = {
    "Index-Funcionalidades-MaxCenter": "../1-Funcionalidades-MC/Index-Funcionalidades-MaxCenter.html",
    "Index-Portal-Remax-BR": "../2-Portal-Remax-BR/Index-Portal-Remax-BR.html",
    "Index-Portal-Remax-Internacional": "../3-Portal-Remax-Internacional/Index-Portal-Remax-Internacional.html",
    "Index-Universidade-Remax": "../4-Universidade-Remax/Index-Universidade-Remax.html",
    "Index-iList": "../5-iList/Index-iList.html",
    "Index-Google-Workspace": "../6-Google-Workspace/Index-Google-Workspace.html",
    "Index-Plataformas-Parceiras": "../7-Plataformas-Parceiras/Index-Plataformas-Parceiras.html",
    "Index-Manuais-e-Normativas": "../8-Manuais-e-Normativas/Index-Manuais-e-Normativas.html",
    "Index-Assuntos-Financeiros": "../9-Assuntos-Financeiros/Index-Assuntos-Financeiros.html",
    "Index-Movidesk": "../10-Movidesk/Index-Movidesk.html",
    "Index-FAQ-Regionais": "../11-FAQ-Regionais/Index-FAQ-Regionais.html",
    "Index-Comunicacao": "../12-Comunicacao/Index-Comunicacao.html",
    "Index-Portais-e-Integracoes": "../13-Portais-e-Integracoes/Index-Portais-e-Integracoes.html",
  };

  var keywords = {
    "portais": "../13-Portais-e-Integracoes/Index-Portais-e-Integracoes.html",
  };

  var keywords2 = {
    "cred": {
      url: "../7-Plataformas-Parceiras/2-Clicksign.html", 
      title: "Clicksign"
    }
  };

  function extractKeywordTitles(pageUrl) {
    var url = keywords[pageUrl];
    if (!url) return [];

    return fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.text();
      })
      .then(html => {
        var parser = new DOMParser();
        var doc = parser.parseFromString(html, 'text/html');
        return extractArticleTitles(doc, url);
      })
      .catch(error => {
        console.error('Erro ao obter conteúdo da página:', error);
        return [];
      });
  }

  function extractKeyword2Titles(pageUrl) {
    const { url, title } = keywords2[pageUrl];
  
    if (!url) return [];
  
    const titles = [{
      title,
      url
    }];
  
    return titles;
  }

  searchBox.addEventListener('input', async function () {
    var searchTerm = searchBox.value.toLowerCase().replace(/[áãâà]/g, 'a').replace(/[éê]/g, 'e').replace(/[í]/g, 'i').replace(/[óõô]/g, 'o').replace(/[ú]/g, 'u').replace(/\s/g, '');

    resultBox.innerHTML = '';
    resultBox.style.display = 'block';
    var addedTitles = new Set();
    // Adiciona as palavras-chave ao resultado da busca
    for (const keyword in keywords2) {
      if (searchTerm.includes(keyword)) {
        try {
          const keyword2Titles = await extractKeyword2Titles(keyword);

          keyword2Titles.forEach(({ title, url }) => {
            var formattedTitle = title.toLowerCase().replace(/[áãâà]/g, 'a').replace(/[éê]/g, 'e').replace(/[í]/g, 'i').replace(/[óõô]/g, 'o').replace(/[ú]/g, 'u').replace(/\s/g, '');

            if (!addedTitles.has(formattedTitle)) {
              addedTitles.add(formattedTitle);
              var resultItem = document.createElement('div');
              var resultTitle = document.createElement('h4');
              resultTitle.textContent = title.replace(/-/g, ' '); 
              resultTitle.classList.add('search-result-title');
              resultItem.appendChild(resultTitle);
              resultItem.classList.add('search-result-item');
              resultBox.appendChild(resultItem);

              resultItem.addEventListener('click', function(event) {
                event.preventDefault();
                window.location.href = url;
              });
            }
          });
        } catch (error) {
          console.error('Erro ao obter conteúdo da página:', error);
        }
      }
    }

    for (const keyword in keywords) {
      if (searchTerm.includes(keyword)) {
        try {
          const keywordTitles = await extractKeywordTitles(keyword);

          keywordTitles.forEach(({ title, url }) => {
            var formattedTitle = title.toLowerCase().replace(/[áãâà]/g, 'a').replace(/[éê]/g, 'e').replace(/[í]/g, 'i').replace(/[óõô]/g, 'o').replace(/[ú]/g, 'u').replace(/\s/g, '');

            if (!addedTitles.has(formattedTitle)) {
              addedTitles.add(formattedTitle);
              var resultItem = document.createElement('div');
              var resultTitle = document.createElement('h4');
              resultTitle.textContent = title.replace(/-/g, ' ');
              resultTitle.classList.add('search-result-title');
              resultItem.appendChild(resultTitle);
              resultItem.classList.add('search-result-item');
              resultBox.appendChild(resultItem);

              resultItem.addEventListener('click', function (event) {
                event.preventDefault();
                window.location.href = url;
              });
            }
          });
        } catch (error) {
          console.error('Erro ao obter conteúdo da página:', error);
        }
      }
    }

    if (!searchTerm) {
      resultBox.style.display = 'none';
      return;
    }

    Object.keys(pages).forEach(function (page) {
      var href = pages[page];

      fetch(href)
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.text();
        })
        .then(html => {
          var parser = new DOMParser();
          var doc = parser.parseFromString(html, 'text/html');
          var titles = extractArticleTitles(doc, href);

          titles.forEach(({ title, url }) => {
            var formattedTitle = title.toLowerCase().replace(/[áãâà]/g, 'a').replace(/[éê]/g, 'e').replace(/[í]/g, 'i').replace(/[óõô]/g, 'o').replace(/[ú]/g, 'u').replace(/\s/g, '');

            if (formattedTitle.includes(searchTerm) && !addedTitles.has(formattedTitle)) {
              addedTitles.add(formattedTitle);
              var resultItem = document.createElement('div');
              var resultTitle = document.createElement('h4');
              resultTitle.textContent = title.replace(/-/g, ' ');
              resultTitle.classList.add('search-result-title');
              resultItem.appendChild(resultTitle);
              resultItem.classList.add('search-result-item');
              resultBox.appendChild(resultItem);

              resultItem.addEventListener('click', function (event) {
                event.preventDefault();
                window.location.href = url;
              });
            }
          });
        })
        .catch(error => {
          console.error('Erro ao obter conteúdo da página:', error);
        });
    });
  });

  document.addEventListener('click', function(event) {
    var isClickInsideElement = function(el) {
      return el.contains(event.target);
    };

    if (!isClickInsideElement(searchBox) && !isClickInsideElement(resultBox)) {
      resultBox.style.display = 'none';
    }
  });
});
//end search system

function redirecionar() {
  window.location.href = "https://remax.movidesk.com/";
}

function handleFeedback() {
  document.getElementById('feedback-buttons').style.display = 'none';
  document.getElementById('feedback-message').style.display = 'block';
}

document.getElementById("star-icon").addEventListener("click", function () {
  this.classList.toggle("far");
  this.classList.toggle("fas");
  this.style.color = this.classList.contains("fas") ? "yellow" : "";
});

var dropdownButton = document.querySelector('.dropdown-button');

dropdownButton.addEventListener('click', function() {
  document.querySelector('.sidebar').classList.toggle('active');
});