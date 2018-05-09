export const getListDemo = async obj => {
  return {
    category: 'all',
    amount: 5,
    listItems: [
      {
        title: 'Make the portal search better',
        description:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.orem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor ',
        voteCount: '81',
        studentVote: '0',
        category: 'general',
        avatar: 'G'
      },
      {
        title:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor',
        description:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
        voteCount: '23',
        studentVote: '1',
        category: 'user interface',
        avatar: 'UI'
      },
      {
        title: 'Make the portal search better',
        description:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.orem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor ',
        voteCount: '81',
        studentVote: '0',
        category: 'general',
        avatar: 'G'
      },
      {
        title: 'Make the portal search better',
        description:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.orem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor ',
        voteCount: '81',
        studentVote: '0',
        category: 'general',
        avatar: 'G'
      }
    ]
  }
}

export const getAdminDemo = async obj => {
  return {
    listItems: [
      {
        title: 'Make the portal search better',
        voteCount: '81',
        category: 'general',
        avatar: 'G'
      },
      {
        title:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor',
        voteCount: '23',
        category: 'user interface',
        avatar: 'UI'
      },
      {
        title: 'Make the portal search better',
        voteCount: '81',
        category: 'general',
        avatar: 'G'
      },
      {
        title: 'Make the portal search better',
        voteCount: '81',
        category: 'general',
        avatar: 'G'
      }
    ]
  }
}

export const categoryValues = [
  'general',
  'design',
  'issue',
  'navigation',
  'mobile',
  'feature'
]
export const categoryLabels = [
  'General',
  'Design',
  'Issue',
  'Navigation',
  'Mobile Apps',
  'New Feature'
]
export const titleMax = 60
export const descriptionMax = 800

export const submitIdea = async (title, desc, cat, token) => {
  try {
    let response, status
    let data = {
      title: title,
      description: desc,
      category: cat
    }

    const formBody = Object.keys(data)
      .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(data[key]))
      .join('&')

    response = await fetch(
      'http://localhost:8080/ideas/api/v1/submitIdea',
      {
        method: 'POST',
        body: formBody,
        credentials: 'include',
        headers: {
          Authorization: 'Bearer ' + token,
          Accept: 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    )
    status = await response.status
    console.log(status)
    return status
  } catch (err) {
    console.log(err)
  }
}

export const submitVote = async (ideaID, createdAt, voteValue, token) => {
  try {
    let response
    let data = {
      ideaID: ideaID,
      voteValue: voteValue,
      time: createdAt
    }

    const formBody = Object.keys(data)
      .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(data[key]))
      .join('&')

    response = await fetch(
      'http://localhost:8080/ideas/api/v1/submitVote',
      {
        body: formBody,
        credentials: 'include',
        headers: {
          Authorization: 'Bearer ' + token,
          Accept: 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        method: 'POST'
      }
    )
  } catch (err) {
    console.log(err)
  }
}

export const getList = async obj => {
  try {
    let response = await fetch(
      'http://localhost:8080/ideas/api/v1/getList',
      {
        credentials: 'include',
        headers: { Authorization: 'Bearer ' + obj.token }
      }
    )
    let blob = await response.json()
    return blob
  } catch (err) {
    console.error(err)
  }
}

export const getAdminData = async obj => {
  let status, list
  try {
    const url = 'http://localhost:8080/ideas/api/v1/' + obj.url
    let response = await fetch(url, {
      credentials: 'include',
      headers: { Authorization: 'Bearer ' + obj.token }
    })
    status = await response.status
    list = await response.json()

    return { list, status }
  } catch (err) {
    console.error(err)
    return { list, status }
  }
}

export const editIdea = async obj => {
  try {
    let response
    let data = {
      id: obj.id,
      title: obj.title,
      description: obj.description,
      category: obj.category,
      approved: obj.approved,
      startVoteDate: obj.start + ' 00:00:00',
      endVoteDate: obj.end + ' 00:00:00'
    }

    const formBody = Object.keys(data)
      .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(data[key]))
      .join('&')

    let url = 'editIdea'
    if (obj.flagged === true) {
      url = 'flagIdea'
    } else if (obj.is_archived === true) {
      url = 'archiveIdea'
    }

    response = await fetch('http://localhost:8080/ideas/api/v1/' + url, {
      body: formBody,
      credentials: 'include',
      headers: {
        Authorization: 'Bearer ' + obj.token,
        Accept: 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      method: 'POST'
    })
  } catch (err) {
    console.log(err)
  }
}

export const adminCheck = async token => {
  try {
    const url = 'http://localhost:8080/ideas/api/v1/adminCheck'
    let response = await fetch(url, {
      method: 'POST',
      credentials: 'include',
      headers: { Authorization: 'Bearer ' + token }
    })
    let blob = await response.json()
    return blob
  } catch (err) {
    console.error(err)
    return 'error'
  }
}

export const isListEmpty = async () => {
  try {
    const url = 'http://localhost:8080/ideas/api/v1/isListEmpty'
    let response = await fetch(url, {
      method: 'POST',
      credentials: 'include'
    })
    let blob = await response.json()
    return blob
  } catch (err) {
    console.error(err)
    return 'error'
  }
}
