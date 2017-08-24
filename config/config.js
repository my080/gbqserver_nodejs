var config = {    
    mongo:{
        ip: "127.0.0.1",
        port: "27017"
    },
    qdkapi:{
        projectspec: "http://10.129.8.187:8080/api/Features/",
        catalogs: "http://10.129.8.187:8080/api/TradeCatalogs",
        BQItemDBs: "http://10.129.8.187:8080/api/BQItemDBs",
        BQItemDB: "http://10.129.8.187:8080/api/BQItemDB/"
    },
	upload: {
        path: process.cwd() + '/public/file/'
    },
    download: {
    	path: process.cwd() + '/public/file/'
    },
    mimeTypes: {  
        '.txt': 'text/plain',
        '.md': 'text/plain',
        '': 'text/plain',
        '.html': 'text/html',
        '.css': 'text/css',
        '.js': 'application/javascript',
        '.json': 'application/json',
        '.jpg': 'image/jpeg',
        '.png': 'image/png', 
        '.gif': 'image/gif' 
    },
    dir: {
    	"image": ['.jpg', '.png', '.gif', '.jpeg'],
    	"json": ['.json'],
    	"txt": ['.txt'],
        "excel": ['.xlsx']
    }
}

module.exports = config;
