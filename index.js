const fs = require('fs');
const path = require('path');
const natural = require('natural');


//localização onde esta os txt
const diretorioTxt = path.join(__dirname, 'past.txt')
console.log('Lendo a pasta');

// stopwords para portugues
const stopWordsPt = new Set(natural.stopwords.pt)

// função para limpar o texto (caracteres especiais)
const clearTxt = text => {
    return text.replace(/[^\w\s]/gi, '');
};

//função para remover stopwords
const removeStopWords = text => {
    const words = text.split(/\s+/);
    const filteredWords = words.filter(word => !stopWordsPt.has(word.toLowerCase()));
    return filteredWords.join(' ');
}


// função para lematização do texto
const lemmatize = text =>{
    const tokenizar = new natural.WordTokenizer();
    const tokens = tokenizar.tokenize(text);
    const stemmer = natural.PorterStemmerPt;
    const lematizarTokens = tokens.map(token => stemmer.stem(token))
    return lematizarTokens.join(' ')
}

// detectar linguagem
const detectarLinguage = text => {
    return natural.detectLanguage(text);
}


// Leitura do diretorio
fs.readdir(diretorioTxt, (err, files) =>{
    if(err){
        return console.log('Erro ao ler diretorio', err);
    }

    // filtra os arquivos em .txt
    files.filter(file => path.extname(file) === '.txt')

    //leitura de conteudo de cada .txt
    .forEach(file => {

        //referenciando onde esta os arquivos txt
        const arquivosTxt = path.join(diretorioTxt, file)

        //Le o conteudo do txt
        fs.readFile(arquivosTxt, 'utf-8', (err, data) =>{
            if(err){
                return console.log('Erro ao ler o arquivo ${file}');
            }


            let textoProcessado = clearTxt(data);
            textoProcessado = textoProcessado.toLowerCase();
            textoProcessado = removeStopWords(textoProcessado);
            textoProcessado = lemmatize(textoProcessado);

            console.log(`Conteúdo de ${file}:`);
            console.log('-----------------------------------------------');
            
        })
    })






})
