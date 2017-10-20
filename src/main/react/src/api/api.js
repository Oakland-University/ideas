export const getListDemo = async obj => {
  return {
    category: "all",
    amount: 5,
    listItems: [
      {
        title: "Make the portal search better",
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.orem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor ",
        voteCount: "81",
        studentVote: "0",
        category: "general",
        avatar: "G"
      },
      {
        title:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor",
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
        voteCount: "23",
        studentVote: "1",
        category: "user interface",
        avatar: "UI"
      },
      {
        title: "Make the portal search better",
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.orem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor ",
        voteCount: "81",
        studentVote: "0",
        category: "general",
        avatar: "G"
      },
      {
        title: "Make the portal search better",
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.orem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor ",
        voteCount: "81",
        studentVote: "0",
        category: "general",
        avatar: "G"
      }
    ]
  }
}

export const submitIdea = async (title, desc, cat, token) => {
  try {
    let response
    let data = {
      title: title,
      description: desc,
      category: cat
    }

    const formBody = Object.keys(data)
      .map(key => encodeURIComponent(key) + "=" + encodeURIComponent(data[key]))
      .join("&")

    response = await fetch("http://localhost:8080/ideas/api/v1/submitIdea", {
      body: formBody,
      credentials: "include",
      headers: {
        Authorization: token,
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST"
    })
    let blob = await response.json()
  } catch (err) {
    console.log(err)
  }
}

export const submitVote = async (ideaID, createdAt, voteValue, token) => {
  console.log("Submitting Idea")
  //const d = new Date().toISOString()
  try {
    let response
    let data = {
      ideaID: ideaID,
      voteValue: voteValue,
      time: createdAt
    }

    const formBody = Object.keys(data)
      .map(key => encodeURIComponent(key) + "=" + encodeURIComponent(data[key]))
      .join("&")

    response = await fetch("http://localhost:8080/ideas/api/v1/submitVote", {
      body: formBody,
      credentials: "include",
      headers: {
        Authorization: "Bearer " + token,
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST"
    })
    let blob = await response.json()
    console.log(blob)
  } catch (err) {
    console.log(err)
  }
}

export const getList = async obj => {
  try {
    let response = await fetch("http://localhost:8080/ideas/api/v1/getList", {
      credentials: "include",
      headers: { Authorization: "Bearer " + obj.token }
    })
    let blob = await response.json()
    console.log(blob)
    return blob
  } catch (err) {
    console.error(err)
  }
}
