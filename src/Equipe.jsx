import { useEffect, useState } from "react";
import { supabase } from './supabaseClient';
//import './App.css';

function Equipe() {

  const email = localStorage.getItem('email');
  const authorized = email == 'amndrocha@gmail.com';
  // console.log('email: '+email);
  // console.log('authorized: '+authorized);

  const [equipe, setEquipe] = useState([]);
  const [current, setCurrent] = useState({
    id: '',
    category: '',
    name: '',
    contact: '',
    job: '',
    action: '',
  });

  useEffect(() => {
    getEquipe();
  }, []);

  async function getEquipe() {
    const { data } = await supabase.from("equipe").select();
    setEquipe(data);
  }

  let categories = [];

  equipe.map((member) => {
    if (!categories.includes(member.category)) {
      categories.push(member.category)
    }
  })

  let lista = categories.map((category) => {
    return ({title: category, members: []})
  })

  equipe.map((member) => {
    categories.map((category, i) => {
      if (member.category === category) {
        lista[i].members.push(member);
      }
    })
  })

  function closeModal() {
    setCurrent({
      id: '',
      category: '',
      name: '',
      contact: '',
      job: '',
      action: '',
    });
  }

  function edit(member) {
    setCurrent({
      id: member.id,
      category: member.category,
      name: member.name,
      contact: member.contact,
      job: member.job,
      action: 'edit',
    });
  }

  const [isRemoving, setIsRemoving] = useState(false);

  const removeRow = async (idToRemove) => {
    try {
      setIsRemoving(true);
      const { data, error } = await supabase
        .from("equipe")
        .delete()
        .eq('id', idToRemove);
  
      if (error) {
        console.error('Error removing row:', error.message);
      } else {
        console.log('Row removed successfully:', data);
        setEquipe(prevEquipe => prevEquipe.filter(member => member.id !== idToRemove));
      }
    } catch (error) {
      console.error('Error removing row:', error.message);
    } finally {
      setIsRemoving(false);
      alert('Dados removidos com sucesso')
    }
  };

  const modifyRow = async (idToUpdate, newData) => {
    try {
      const { data, error } = await supabase
        .from('equipe')
        .update(newData)
        .eq('id', idToUpdate);
  
      if (error) {
        console.error('Error modifying row:', error.message);
      } else {
        console.log('Row modified successfully:', data);
        // Optionally, you can perform additional actions after the row is modified
      }
    } catch (error) {
      console.error('Error modifying row:', error.message);
    }
  };

  

  return (
    <div id="equipeContent" className="middle">
      <div className={current.action === '' ? 'none' : 'modal'} onClick={closeModal}>
        <div className="modalBox">{current.action} {current.id}</div>
      </div>
      <button className={authorized ? 'adminBtn' : 'none'}>add</button>
      {lista.map((category) => {
        return (
        <div className="categoriaEquipe" key={category.title}>
          <h1 className="title">{category.title}</h1>
          {category.members.map((member) => {
            return(
              <div className="membroEquipeWrapper">
                <button  className={authorized ? 'adminBtn' : 'none'}
                onClick={() => removeRow(member.id)}
                disabled={isRemoving}>Remover {member.name}</button>
                <div className="membroEquipe" key={member.id}>
                  <img className="equipeImage"/>
                  <div className="membroInfo">
                    <div className="buttonWrapper">
                      <h2 className="name">{member.name}</h2>
                      <button className={authorized ? 'adminBtn' : 'none'}
                      onClick={() => edit(member)}>Editar</button>
                    </div>
                    <div className="buttonWrapper">
                      <h3 className="job">{member.job}</h3>
                      <button className={authorized ? 'adminBtn' : 'none'}
                      onClick={() => edit(member)}>Editar</button>
                    </div>
                    <div className="buttonWrapper">
                      <p className="contact">{member.contact}</p>
                      <button className={authorized ? 'adminBtn' : 'none'}
                      onClick={() => edit(member)}>Editar</button>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>)
      })}
    </div>
  );
}

export default Equipe;