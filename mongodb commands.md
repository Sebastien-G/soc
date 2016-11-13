



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
