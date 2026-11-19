import React, { useState, useEffect } from 'react';
import "./Dealers.css";
import "../assets/style.css";
import Header from '../Header/Header';
import review_icon from "../assets/reviewicon.png"
import { useNavigate, useParams } from 'react-router-dom';

const Dealers = () => {
  const [dealersList, setDealersList] = useState([]);
  // let [state, setState] = useState("")
  let [states, setStates] = useState([])
  const navigate = useNavigate();
  const { state } = useParams();

  // let root_url = window.location.origin
  let dealer_url ="/djangoapp/get_dealers";
 
  const filterDealers = async (state) => {
    navigate(state === 'All' ? '/dealers' : `/dealers/${encodeURIComponent(state)}`);
  }

  const get_dealers = async ()=>{
    const selected_url = state ? `${dealer_url}/${encodeURIComponent(state)}` : dealer_url;
    const res = await fetch(selected_url, {
      method: "GET"
    });
    const retobj = await res.json();
    if(retobj.status === 200) {
      let all_dealers = Array.from(retobj.dealers || [])
      let states = [];
      all_dealers.forEach((dealer)=>{
        states.push(dealer.state)
      });

      setStates(Array.from(new Set(states)))
      setDealersList(all_dealers)
    }
  }
  // Refresh when the state in the address changes.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    get_dealers();
  },[state]);


let isLoggedIn = sessionStorage.getItem("username") != null ? true : false;
return(
  <div>
      <Header/>

     <table className='table'>
      <tbody><tr>
      <th>ID</th>
      <th>Dealer Name</th>
      <th>City</th>
      <th>Address</th>
      <th>Zip</th>
      <th>
      <select name="state" id="state" value={state || ''} onChange={(e) => filterDealers(e.target.value)}>
      <option value="" disabled hidden>State</option>
      <option value="All">All States</option>
      {states.map(state => (
          <option key={state} value={state}>{state}</option>
      ))}
      </select>        

      </th>
      {isLoggedIn ? (
          <th>Review Dealer</th>
         ):<></>
      }
      </tr>
     {dealersList.map(dealer => (
        <tr key={dealer.id}>
          <td>{dealer['id']}</td>
          <td><a href={'/dealer/'+dealer['id']}>{dealer['full_name']}</a></td>
          <td>{dealer['city']}</td>
          <td>{dealer['address']}</td>
          <td>{dealer['zip']}</td>
          <td>{dealer['state']}</td>
          {isLoggedIn ? (
            <td><a href={`/postreview/${dealer['id']}`}><img src={review_icon} className="review_icon" alt="Post Review"/></a></td>
           ):<></>
          }
        </tr>
      ))}
     </tbody></table>
  </div>
)
}

export default Dealers
