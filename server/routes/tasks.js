const express = require("express");

// taskRoutes is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /task.
const taskRoutes = express.Router();

// This will help us connect to the database
const dbo = require("../db/conn");

// This help convert the id from string to ObjectId for the _id.
const ObjectId = require("mongodb").ObjectId;

// parse the query attributes into a JSON search object
function validQP(qp) {
  return (qp && (typeof qp === "string" && qp.length > 0));
}

function parseQuery(reqQuery) {
  var qry = '';
  var any = false;

  if (validQP(reqQuery.completed)) {
    qry += '"completed": ';
    if (reqQuery.completed === "false") {
      qry += "false";
    } else {
      qry += "true";
    }
    any = true;
  }
  
  if (validQP(reqQuery.due)) {
    if (any) {
      qry += ", ";
    }
    any = true;
    qry += '"due": "' + reqQuery.due + '"';
  }
  
  if (validQP(reqQuery.tag)) {
    if (any) {
      qry += ", ";
    }
    any = true;
    qry += '"tag": "' + reqQuery.tag + '"';
  }

  // if no fields have been added, make sure 'item' exists so it's a task and not something else
  if (qry.length <= 0) {
    qry = '"emp_age": { $exists: true }';
  }
  return JSON.parse('{' + qry + '}');
}

// This section will help you get a list of all the tasks.
taskRoutes.route("/task").get(function (req, res) {
  let db_connect = dbo.getDb();
  let query = parseQuery(req.query);
  db_connect
    .collection("tasks")
    .find(query)
    .toArray(function (err, result) {
      if (err) throw err;
      res.json(result);
    });
});

// This section will help you get a single record by id
taskRoutes.route("/task/:id").get(function (req, res) {
  let db_connect = dbo.getDb();
  let myquery = { _id: ObjectId( req.params.id )};
  db_connect
      .collection("tasks")
      .findOne(myquery, function (err, result) {
        if (err) throw err;
        res.json(result);
      });
});

// This section will help you create a new record.
taskRoutes.route("/task/add").post(function (req, response) {
  let db_connect = dbo.getDb();
  let myobj = {
    item: req.body.item,
    due: req.body.due,
    note: req.body.note,
    tag: req.body.tag,
    completed: req.body.completed
  };
  db_connect.collection("tasks").insertOne(myobj, function (err, res) {
    if (err) throw err;
    addTag(req.body.tag);
    response.json(res);
  });
});

// This section will help you update a record by id.
taskRoutes.route("/update/:id").post(function (req, response) {
  let db_connect = dbo.getDb();
  let myquery = { _id: ObjectId( req.params.id )};
  let newvalues = {
    $set: {
      item: req.body.item,
      due: req.body.due,
      note: req.body.note,
      tag: req.body.tag,
      completed: req.body.completed
    },
  };
  db_connect
    .collection("tasks")
    .updateOne(myquery, newvalues, function (err, res) {
      if (err) throw err;
      console.log("1 document updated");
      addTag(req.body.tag);
      response.json(res);
    });
});

// This section will help you delete a record
taskRoutes.route("/:id").delete((req, response) => {
  let db_connect = dbo.getDb();
  let myquery = { _id: ObjectId( req.params.id )};
  db_connect.collection("tasks").deleteOne(myquery, function (err, obj) {
    if (err) throw err;
    console.log("1 document deleted");
    response.json(obj);
  });
});

// This section gets a list of all tags
taskRoutes.route("/tags").get(function (req, res) {
  let db_connect = dbo.getDb();
  db_connect
      .collection("tasks")
      .findOne({tagList: true}, function (err, result) {
        if (err || (!result)) {
          res.json([]);
        } else {
          res.json(result.tags);
        }
      });
});

// add a tag
function addTag(tag) {
  if (!tag || tag.length <= 0) return;
  let db_connect = dbo.getDb();
  db_connect
      .collection("tasks")
      .findOne({tagList: true}, function (err, result) {
        if (err) throw err;

        // add if not there
        if (!result) {
          console.log("no tag record");
          db_connect.collection("tasks").insertOne({tagList: true, tags: [tag]}, function (err, res) {
            if (err) throw err;
            return;
          });
        } else if (!result.tags.includes(tag)) {
          console.log("adding-" + tag);
          var newList = result.tags;
          newList.push(tag);
          newObj =  {$set: {tagList: true,
                    tags: newList
                  },};
          console.log("about to add, result-" + result); 
          db_connect
          .collection("tasks")
          .updateOne({_id: result._id}, newObj, function (err, res) {
            if (err) throw err;
            return;
          });
        } else {
          console.log(tag + " already there");
        }
      });
};


module.exports = taskRoutes;
