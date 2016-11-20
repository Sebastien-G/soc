

## Add field to `users` collection

    db.users.update(
      {
        profilePicId: {
          $exists: false
        }
      },
      {
        $set: {
          profilePicId: "default.png"
        }
      },
      {
        multi: true
      }
    )



## Update user role to admin

    db.users.update(
      {
        '_id': {
          $eq: ObjectId("581fc388c0d82830a0ee0993")
        }
      },
      {
        $set: {
          role: "admin"
        }
      }
    )

## Add profilePic to `users` collection

    db.users.update(
      {
        profilePic: {
          $exists: false
        }
      },
      {
        $set: {
          profilePic: "default_50.png"
        }
      },
      {
        multi: true
      }
    )


## Add gender to `users` collection

    db.users.update(
      {
        gender: {
          $exists: false
        }
      },
      {
        $set: {
          gender: "male"
        }
      },
      {
        multi: true
      }
    )


## Add dateOfBirth to `users` collection

    db.users.update(
      {
        dateOfBirth: {
          $exists: false
        }
      },
      {
        $set: {
          dateOfBirth: new Date()
        }
      },
      {
        multi: true
      }
    )

## Remove field dteOfBirth from `users` collection

    db.users.update(
       {},
       {
         $unset: {
           dteOfBirth: "",
         }
       },
       {
         multi: true
       }
    )


## Add profilePicId to `posts` collection

    db.posts.update(
      {
        profilePic: {
          $exists: false
        }
      },
      {
        $set: {
          profilePic: "default_50.png"
        }
      },
      {
        multi: true
      }
    )


## Update pic by user_id
    db.posts.update(
      {
        user_id: {
          $eq: ObjectId("581fc388c0d82830a0ee0993")
        }
      },
      {
        $set: {
          profilePic: "default_50.png"
        }
      },
      {
        multi: true
      }
    )


## Find all posts by user_id

    db.posts.find(
      {
        user_id: {
          $eq: ObjectId("581fc388c0d82830a0ee0993")
        }
      }
    )


## Find basic users info

    db.users.find(
      {},
      {
        "firstname": true,
        "lastname": true,
        "uid": true,
        "confirmed": true,
        "_id": false
      }
    ).pretty()



db.posts.remove({
  "_id": ObjectId("582cafeac5a85c559cfe6014")
  })


    db.users.find(
      {},
      {
        "firstname": true,
        "lastname": true,
      }
    )
    { "_id" : ObjectId("581fc388c0d82830a0ee0993"), "firstname" : "Sébastien", "lastname" : "Guillon" } 3286c6d7-9c8d-4088-8a07-155077702d72_50.jpg
    { "_id" : ObjectId("58227617ff4cc624209d1b05"), "firstname" : "John", "lastname" : "Galt" }
    { "_id" : ObjectId("582375ecff4cc624209d1b0b"), "firstname" : "Bill", "lastname" : "Gates" } ade4dc9a-ac87-4956-bfa7-9513ccfc250d_50.jpeg
    { "_id" : ObjectId("5825d8ec7db24142f0f0e5b7"), "firstname" : "Elon", "lastname" : "Musk" } 446cdd19-e2f7-4e86-a728-6c7af9ac0973_50.jpg
    { "_id" : ObjectId("582624ba997f282ad0bb1de9"), "firstname" : "Steve", "lastname" : "Wozniak" } 4cc8b37d-cac3-4069-9ede-549fc3538f05_50.jpg
    { "_id" : ObjectId("58262749997f282ad0bb1dea"), "firstname" : "Douglas", "lastname" : "Crockford" } e97b8773-bc44-49ef-abb7-295f117abf9b_50.jpg
    { "_id" : ObjectId("582628a1997f282ad0bb1deb"), "firstname" : "Jeffrey", "lastname" : "Hawkins" } a83dc2ee-4f33-4c0e-9092-426c41e1f62c_50.png
    { "_id" : ObjectId("58274c7e7943da39e4714435"), "firstname" : "Brendan", "lastname" : "Eich" } a7745d0d-b050-4039-81c5-1ec94c622634_50.png
    { "_id" : ObjectId("5827c0de68b67b18c4d99a61"), "firstname" : "Ayn", "lastname" : "Rand" }
    { "_id" : ObjectId("5827c214c1b44d2190a5da91"), "firstname" : "Joel", "lastname" : "Spolsky" } 7ebcc423-158d-4696-8588-fa827aae3d53_50.jpg
    { "_id" : ObjectId("5827c48aff0a952ab88b25d0"), "firstname" : "Gavin", "lastname" : "McInnes" }




    db.posts.update(
      {
        user_id: {
          $eq: ObjectId("58262749997f282ad0bb1dea")
        }
      },
      {
        $set: {
          profilePic: "e97b8773-bc44-49ef-abb7-295f117abf9b_50.jpg"
        }
      },
      {
        multi: true
      }
    )
