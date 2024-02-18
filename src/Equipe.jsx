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
      image: '',
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
      image: member.image,
      action: 'edit',
    });
  }

  const clickedRemove = () => {
    setCurrent({
      id: current.id,
      category: current.category,
      name: current.name,
      contact: current.contact,
      job: current.job,
      image: current.image,
      action: 'remove',
    });
  }

  const [isRemoving, setIsRemoving] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const removeRow = async () => {
    try {
      setIsRemoving(true);
      const { data, error } = await supabase
        .from("equipe")
        .delete()
        .eq('id', current.id);
  
      if (error) {
        console.error('Error removing row:', error.message);
      } else {
        console.log('Row removed successfully:', data);
        setEquipe(prevEquipe => prevEquipe.filter(member => member.id !== current.id));
      }
    } catch (error) {
      console.error('Error removing row:', error.message);
    } finally {
      setIsRemoving(false);
      closeModal();
      alert('Dados removidos com sucesso.');
    }
  };

  const modifyRow = async () => {
    try {
      setIsSaving(true);
      const { data, error } = await supabase
        .from('equipe')
        .update({
          category: current.category,
          name: current.name,
          job: current.job,
        })
        .eq('id', current.id);
  
      if (error) {
        console.error('Error modifying row:', error.message);
      } else {
        console.log('Row modified successfully:', data);
        setEquipe(equipe.map(member => {
          if (member.id !== current.id) {
            return member;
          } else {
            return {            
              id: current.id,
              category: current.category,
              name: current.name,
              job: current.job,
              contact: current.contact,
              image: current.image,
            }
          }
        }));
      }
    } catch (error) {
      console.error('Error modifying row:', error.message);
    } finally {
      setIsSaving(false);
      closeModal();
      alert('Alterações salvas com sucesso.');
    }
  };

  

  return (
    <div id="equipeContent" className="middle">
      <div className={current.action === 'remove' ? 'modal' : 'none'}>
        <div className="modalBox">
          Tem certeza que deseja remover {current.name} do banco de dados?
          <br/>
          Essa ação é irreversível.
          <div className="buttonWrapper">
            <button  className='adminBtn'
            onClick={() => edit(current)}
            disabled={isRemoving}>Voltar</button>
            <button  className='adminBtn'
            onClick={() => removeRow(current.id)}
            disabled={isRemoving}>{isRemoving ? 'Removendo..' : 'Tenho certeza'}</button>              
          </div>
      
        </div>

      </div>
      <div className={current.action === 'edit' ? 'modal' : 'none'}>
        <div className="modalBox">
          <div className="closeBtn">
            <div style={{opacity: 0}}>X</div>
            <button onClick={() => clickedRemove()}
            className='adminBtn'>Remover</button>
            <div style={{cursor: 'pointer'}} onClick={closeModal}>X</div>
          </div>

          <form className="editMemberForm">
            <label for="name">Categoria:<input id="category" type="text" onChange={(e) => setCurrent({...current, category: e.target.value})}value={current.category}/></label>
            <label for="name">Nome:<input id="name" type="text" onChange={(e) => setCurrent({...current, name: e.target.value})}value={current.name}/></label>
            <label for="job">Função:<input id="job" type="text" onChange={(e) => setCurrent({...current, job: e.target.value})}value={current.job}/></label>
            <label for="contact">Contato:<input id="contact" type="text" onChange={(e) => setCurrent({...current, contact: e.target.value})}value={current.contact}/></label>
          </form>
          <button className="adminBtn"
          disabled={isRemoving}
          onClick={modifyRow}>
            {isSaving ? 'Salvando..' : 'Salvar alterações'}
          </button>      
        </div>        
      </div>
      <button className={authorized ? 'adminBtn' : 'none'}>add</button>
      {lista.map((category) => {
        return (
        <div className="categoriaEquipe" key={category.title}>
          <h1 className="title">{category.title}</h1>
          {category.members.map((member) => {
            return(
              <div className="membroEquipeWrapper">
                <button className={authorized ? 'adminBtn' : 'none'}
                onClick={() => edit(member)}>Editar</button>
                <div className="membroEquipe" key={member.id}>
                  <img className="equipeImage" src={member.image === '' ? 'img/blank.png' : member.image}/>
                  <div className="membroInfo">
                    <h2 className="name">{member.name}</h2>
                    <h3 className="job">{member.job}</h3>
                    <p className="contact">{member.contact}</p>
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