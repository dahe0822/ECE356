
import React, { useEffect, useState } from 'react';
import queryString from 'query-string'
import { Button } from 'react-bootstrap';
import '../stylesheets/home.css';


const SearchPage = ({location, user}) => {
  const [searchData,setSearchData] = useState([]);
  const [searchQuery,setSearchQuery] = useState({searchBy:"", searchVal:""});

  useEffect(() => {
    if(!location || !location.search || !user || !user.username) return;
    const qString = queryString.parse(location.search);
    if(Object.keys(qString).length){
      const key = Object.keys(qString)[0];
      const val = qString[key];
      setSearchQuery({searchBy:key, searchVal:val})
      getSearchData(key, val);
    }
  }, [location, user]);

  const getSearchData = async (searchBy, searchVal) => {
    try {
      const response = await fetch(`/api/search/${user.user_id}?${searchBy}=${searchVal}`, {
          method: 'GET'
      });
      const body = await response.json();
      if (response.status !== 200) {
          throw Error(body.message);
      }
      setSearchData(body);
    } catch (error) {
      alert(error);
    }
  };
  
  //follow and unfollow
  const followUnfollow = async (followId, follow) => {
    const data = { user_id: user.user_id, followId };
    const requestUrl = follow ? `/api/follow/${searchQuery.searchBy}` : `/api/unfollow/${searchQuery.searchBy}`;
    try {
      const response = await fetch(requestUrl, {
          method: 'POST',
          headers: {'Content-Type':'application/json'},
          body: JSON.stringify(data)
      });
      const body = await response.json();
      if (response.status !== 200) {
          throw Error(body.message);
      }
      //replacing the 'following' state
      let searchDataNew = [...searchData];
      searchDataNew.find((o, i) => {
          if (o.id ===  followId) {
            searchDataNew[i] = { ...searchDataNew[i], isFollowing: searchDataNew[i].isFollowing===1?0:1 };
            return true; // stop searching
          }
      });
      setSearchData(searchDataNew);
    } catch (error) {
      alert(error);
    }
  };

  let listOfResults = searchData.map(function(result) {
    const { id, name, isFollowing } = result;
    return (
      <tr key={ id.toString() }>
        <td>{ name } </td>
        {isFollowing === 1?
          (<td>  <Button onClick={()=>{followUnfollow(id, false)}} variant="primary"> Followed </Button> </td> ):
          (<td>  <Button onClick={()=>{followUnfollow(id, true)}} variant="outline-primary"> Follow </Button> </td> )
        }         
      </tr>
    );
  });

  return (
    <>
      <div className="container">
        <h2>Searching {searchQuery.searchBy} for: {searchQuery.searchVal} </h2>
        <table className="table">
          <thead>
          <tr>
              <th>name</th>
              <th>follow</th>
          </tr>
          </thead>
          <tbody>
            {listOfResults}
          </tbody>
        </table>
      </div>
    </>
  );
};
  
export default SearchPage;