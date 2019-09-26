var express = require('express').Router();
var multer = require('multer');
var path = require('path');
var connection = require('../config/mysqlConnection');
var fs = require('fs');
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log(req.body);
    // cb(null, "upload/");
    getFolderName(req.body).then((data) => {
      let dirPath = "assets/" + data;
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath);
        cb(null, "assets/" + data);
      } else {
        cb(null, "assets/" + data);
      }
    })
  },
  filename: function (req, file, cb) {
    // console.log(`file =>${JSON.stringify(file)}`);
    getImageName(req.body).then((rows) => {
      cb(null, rows[0].doc_code + "_" + rows[0].doc_number + "_" + Date.now() + path.extname(file.originalname)) //Appending extension
    });

  }
})

function getFolderName(reqData) {
  return new Promise((resolve, reject) => {
    let stmt = `SELECT * FROM users WHERE _id = ?`;
    let field = [reqData.userId];
    connection.query(stmt, field, (err, results, field) => {
      if (err) {
        console.error(err.message);
      }
      resolve(results[0].firstname);
    })
  })


}

function getImageName(reqData) {
  return new Promise((resolve, reject) => {
    connection.query('select * from document_type WHERE _id = ?', [reqData.docTypeId], (err, rows, fields) => {
      if (!err) {
        //res.send(rows);
        // let imageName = rows[0].doc_code + "_" + rows[0].doc_number;
        console.log(rows);
        resolve(rows);
      }
      else {
        console.log(err);
      }
    });
  })
}

var upload = multer({ storage: storage });

express.post('/profile', upload.single('kycImage'), function (req, res, next) {
  // req.file is the `avatar` file
  // req.body will hold the text fields, if there were any
  console.log(req.file);
  console.log(req.file);
  getImageName(req.body).then((data) => {
    /* console.log(
      `doc_type =>${data[0].doc_code}
      doc_name =>${req.file.filename}
      doc_path =>${req.file.path}
      doc_destination =>${req.file.destination}
      doc_number =>${data[0].doc_number}
      userId =>${req.body.userId}
      doc_id =>${req.body.docTypeId}
    `) */
    let stmt = `INSERT INTO documents(doc_type,doc_name,doc_path,doc_destination,doc_number,user_id,doc_id) VALUES(?,?,?,?,?,?,?)`;
    let field = [data[0].doc_code, req.file.filename, req.file.path, req.file.destination, data[0].doc_number, req.body.userId, req.body.docTypeId];
    connection.query(stmt, field, (err, results, fields) => {
      if (err) {
        return console.error(err.message);
      }
      // get inserted id
      console.log('Todo Id:' + results.insertId);
      res.format({
        json: () => {
          res.status(200).send({
            message: "Image uploades successfully."
          });
        }
      })
    });

  })
})

express.post("/getImages", (req, res) => {
  let reqData = req.body;
  connection.query('select * from documents WHERE doc_type = ?', [reqData.doc_type], (err, rows, fields) => {
    if (!err) {
      //res.send(rows);
      // let imageName = rows[0].doc_code + "_" + rows[0].doc_number;
      // console.log(rows);

      //console.log(rows[0].doc_path);
      let i;
      let promises = [];

      for (let i = 0; i < rows.length; i++) {
        promises.push(getImage(rows[i]));
      }

      console.log(promises)

      Promise.all(promises)
        .then((results) => {
          //console.log("All done", results);
          res.format({
            json: () => {
              res.status(200).send({
                message: "Image uploades successfully.",
                data: results
              });
            }
          })
        })
        .catch((e) => {
          // Handle errors here
        });


    }
    else {
      console.log(err);
    }
  });

})

function getImage(data) {
  console.log("hello");
  return new Promise((resolve, reject) => {
    fs.readFile(data.doc_path, 'base64',
      (err, base64Image) => {
        // 2. Create a data URL
        // const dataUrl = `data:image/jpeg;base64, ${base64Image}`
        //res.send(dataUrl);
        resolve({
          id: data._id,
          image: base64Image
        })
      }
    );

  })
}

module.exports = express