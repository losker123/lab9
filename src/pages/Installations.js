import React, { useState, useEffect } from 'react';
import installationsData from '../pages/Installations.json';
import '../styles/Systems.css';
import Installationsitem from '../components/Installationsitem';
import Addpopup from '../components/Addpopup';
import { useSelector, useDispatch } from 'react-redux';
import { setInstallations } from '../redux/actions'; 
const Installations = () => { 
  const dispatch = useDispatch();
  const installations = useSelector((state) => state.installations.installations);
 
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch("http://localhost:5000/installations");
      const jsonData = await response.json();
      dispatch(setInstallations(jsonData));
      
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  
  const [newInstallation, setNewInstallation] = useState({
    operation_type: '',
    system_type:'',
    date_time: '',
    person: {
      years_of_experience: '',
      full_name: '',
      contact_information: '',
      photo: 'https://samara.pozitive.org/images/notebooki/tseni/samara.jpg'
    },
    address: ''
  });
  const handleDeleteInstallation = async (id) => {
    if (id) {
      const responseInt = await fetch(
        `http://localhost:5000/installations/${id}`,
        {
          method: "GET",
        }
      );
      const deletedInstallation = await responseInt.json();
      const personId = deletedInstallation.PersonId;
  
      const response = await fetch(
        `http://localhost:5000/installations/${id}`,
        {
          method: "DELETE",
        }
      );
      const responsePerson = await fetch(
        `http://localhost:5000/persons/${personId}`,
        {
          method: "DELETE",
        }
      );
      
      dispatch({ type: "DELETE_INSTALLATIONS", payload: id });
    }
    
    const updatedInstallations = installations.filter(installation => installation.id !== id);
    dispatch(setInstallations(updatedInstallations));
  };
  const handleEditInstallation = async (editedInstallation) => {
    const updatedInstallations = installations.map(installation => {
      if (installation.id === editedInstallation.id) {
        return editedInstallation;
      }

      return installation;
    });
    const responsePerson = await fetch(
      `http://localhost:5000/persons/${editedInstallation.PersonId}`,
      {
        method: "PUT",  
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({  PersonId:editedInstallation.Person }),
      }
    )
    const response = await fetch(
      `http://localhost:5000/installations/${editedInstallation.id}`,
      {
        method: "PUT",  
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ editedInstallation }),
      }
    )
    dispatch(setInstallations(updatedInstallations));

    
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('person.')) {
      const personProperty = name.split('.')[1];
      setNewInstallation((prevState) => ({
        ...prevState,
        person: {
          ...prevState.person,
          [personProperty]: value
        }
      }));
    } else {
      setNewInstallation({
        ...newInstallation,
        [name]: value
      });
    }
  };

  const handleAddInstallation = async () => {
    const responsePerson = await fetch("http://127.0.0.1:5000/persons", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newInstallation.person),
    });
    const personId = (await responsePerson.json()).id;
    const response = await fetch("http://127.0.0.1:5000/installations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({newInstallation,PersonId:personId}),
      
    });
   
    setInstallations([...installations, newInstallation]);
    setNewInstallation({
      operation_type: '',
      system_type: '',
      date_time: '',
      person: {
        years_of_experience: '',
        full_name: '',
        contact_information: '',
        photo: 'https://samara.pozitive.org/images/notebooki/tseni/samara.jpg'
      },
      address: ''
    });
  
  };

  return (
    <>
      <div className="systemPage-container">
        {installations.map((installation) => (
          <Installationsitem
            key={installation.id}
            installation={installation}
            onDelete={handleDeleteInstallation} 
            onEdit = {handleEditInstallation}
          />
        ))}
      </div>

        <Addpopup
          newInstallation={newInstallation}
          handleInputChange={handleInputChange}
          handleAddInstallation={handleAddInstallation}
        />
        
    </>
  );
};

export default Installations;
