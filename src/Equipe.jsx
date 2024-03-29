import { useEffect, useState } from "react";
import { supabase } from './supabaseClient';
import { useNavigate } from "react-router-dom";
import CardOverlay from "./CardOverlay";

function Equipe() {
  const navigate = useNavigate();
  const [equipe, setEquipe] = useState([]); 
  const [current, setCurrent] = useState({
    id: '',
    category: '',
    name: '',
    contact: '',
    job: '',
    action: '',
    image: '',
    mobile: '',
  });
  const [card, setCard] = useState(null); 

  const [authorized, setAuthorized] = useState(null);
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setAuthorized(session)
    })

    supabase.auth.onAuthStateChange((_event, session) => {
      setAuthorized(session)
    })
  }, [])

  async function getEquipe() {
    const { data } = await supabase.from("equipe").select();
    setEquipe(data.sort((a, b) => a.order - b.order));
  }

  useEffect(() => {
    getEquipe();
  }, []);

  window.addEventListener('close-card', () => {
    setCard(null);
  });

  const reorderEquipe = async () => {
    let categories = ['Sócios', 'Jurídico', 'Administrativo'];
    let groupedEquipe = {
        'Sócios': [],
        'Jurídico': [],
        'Administrativo': [],
        'Others': [],
    };

    equipe.forEach(member => {
      if (categories.includes(member.category)) {
        groupedEquipe[member.category].push(member);
      } else {
        groupedEquipe['Others'].push(member);
      }
    });

    const reorderedEquipe = [
        ...groupedEquipe['Sócios'],
        ...groupedEquipe['Jurídico'],
        ...groupedEquipe['Administrativo'],
        ...groupedEquipe['Others']
    ];

    reorderedEquipe.forEach(async (member, index) => {
        member.order = index;
        try {
          const { data, error } = await supabase
            .from('equipe')
            .update({ order: index })
            .eq('id', member.id);
    
          if (error) {
            console.error('Error reordering equipe:', error.message);
          } else {
            getEquipe();
            console.log('Equipe member successfully: '+data);
          }
        } catch (error) {
          console.error('Error updating member order:', error.message);
        }
    });
  }; 

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
      mobile: '',
    });
  }

  function clickedAdd(category) {
    setCurrent({
      id: current.id,
      category: category,
      name: current.name,
      contact: current.contact,
      job: current.job,
      image: current.image,
      mobile: current.mobile,
      action: 'add',
    });
  }

  function clickedEdit(member) {
    setCurrent({
      id: member.id,
      category: member.category,
      name: member.name,
      contact: member.contact,
      job: member.job,
      image: member.image,
      mobile: member.mobile,
      action: 'edit',
    });
  }

  const clickedDelete = () => {
    setCurrent({
      id: current.id,
      category: current.category,
      name: current.name,
      contact: current.contact,
      job: current.job,
      image: current.image,
      mobile: current.mobile,
      action: 'delete',
    });
  }

  const [isProcessing, setIsProcessing] = useState(false);

  const deleteMember = async () => {
    try {
      setIsProcessing(true);
      const { data, error } = await supabase
        .from("equipe")
        .delete()
        .eq('id', current.id);
  
      if (error) {
        console.error('Error removing row:', error.message);
      } else {
        console.log('Row deleted successfully:', data);
        getEquipe();
      }
    } catch (error) {
      console.error('Error removing row:', error.message);
    } finally {
      setIsProcessing(false);
      closeModal();
      alert('Dados removidos com sucesso.');
    }
  };

  function checkPhone() {
    const pattern = /^\(\d{2}\) \d{5}-\d{4}$/;
    return pattern.test(current.mobile);
  }

  const modifyMember = async () => {
    if (checkPhone()) {
      try {
        setIsProcessing(true);
        const { data, error } = await supabase
          .from('equipe')
          .update({
            category: current.category,
            name: current.name,
            job: current.job,
            contact: current.contact,
            mobile: current.mobile,
            image: current.image,
          })
          .eq('id', current.id);
    
        if (error) {
          console.error('Error modifying row:', error.message);
        } else {
          getEquipe();
          console.log('Row modified successfully:', data);
        }
      } catch (error) {
        console.error('Error modifying row:', error.message);
      } finally {
        setIsProcessing(false);
        closeModal();
        alert('Alterações salvas com sucesso.');
      }
    } else {
      alert('O número de celular deve estar no modelo (21) 9xxxx-xxxx');
    }

  };

  const addMember = async () => {
    if (checkPhone()) {
      try {
        const { data, error } = await supabase
          .from('equipe')
          .insert({
            category: current.category,
            name: current.name,
            job: current.job,
            contact: current.contact,
            mobile: current.mobile,
            image: current.image,
            order: equipe.length,
          });
    
        if (error) {
          console.error('Error adding '+current.name+':', error.message);
        } else {
          getEquipe();
          setIsProcessing(false);
          console.log('Successfully added '+current.name+':'+data);
          alert(current.name+' foi adicionado(a) com sucesso.');
          closeModal();
        }
      } catch (error) {
        console.error('Error adding member:', error.message);
      }
      reorderEquipe();      
    } else {
      alert('O número de celular deve estar no modelo (21) 9xxxx-xxxx');
    }
  };

  const handleSignOut = () => {
    supabase.auth.signOut();
    localStorage.clear();
  }

  const isMovingAllowed = (member, direction) => {
    const sameCategoryMembers = equipe.filter(m => m.category === member.category);
    sameCategoryMembers.sort((a, b) => a.order - b.order);

    const currentIndex = sameCategoryMembers.findIndex(m => m.id === member.id);

    if (direction === 'increase') {
        return !(currentIndex === sameCategoryMembers.length - 1 || sameCategoryMembers[currentIndex].order + 1 !== sameCategoryMembers[currentIndex + 1].order);
    } else if (direction === 'decrease') {
        return !(currentIndex === 0 || sameCategoryMembers[currentIndex].order - 1 !== sameCategoryMembers[currentIndex - 1].order);
    }
  };

  const changePosition = async (member, direction) => {
    const sameCategoryMembers = equipe.filter(m => m.category === member.category);
    sameCategoryMembers.sort((a, b) => a.order - b.order);
    const currentIndex = sameCategoryMembers.findIndex(m => m.id === member.id);

    let newOrder;
    if (direction === 'increase') {
        newOrder = member.order + 1;
    } else if (direction === 'decrease') {
        newOrder = member.order - 1;
    }

    const updatedMembers = sameCategoryMembers.map((m, index) => {
        if (index === currentIndex) {
            return { ...m, order: newOrder };
        } else if (direction === 'increase' && index === currentIndex + 1) {
            return { ...m, order: m.order - 1 };
        } else if (direction === 'decrease' && index === currentIndex - 1) {
            return { ...m, order: m.order + 1 };
        } else {
            return m;
        }
    });

    try {
        const { data, error } = await Promise.all(updatedMembers.map(async m => {
            await supabase
                .from('equipe')
                .update({ order: m.order })
                .eq('id', m.id);
        }));

        if (error) {
          console.error('Error reorganizing data:', error.message);
        } else {
          getEquipe();
          console.log('Data reorganized succesfully:'+data);
        }
    } catch (error) {
        console.error('Error reorganizing data:', error.message);
    }
};

  const logEquipe = () => {
    equipe.map(member => {
      console.log(member.order+' '+member.category+' '+member.name)
    })
  }
  
  return (
    <div id="equipeContent" className="middle">
      <CardOverlay data={card}/>
      <div className="gap"></div>
      <div className={authorized ? 'buttonWrapper' : 'none'}>
        <button className="adminBtn" onClick={logEquipe}>Log</button>
        <button className="adminBtn" onClick={reorderEquipe}>Fix up/down</button>
      </div>
      <div className={current.action === 'delete' ? 'modal' : 'none'}>
        <div className="modalBox">
          Tem certeza que deseja deletar {current.name} do banco de dados?
          <br/>
          Essa ação é irreversível.
          <div className="buttonWrapper">
            <button onClick={() => clickedEdit(current)}
            className='adminBtn'>Voltar</button>
            <button  className='adminBtn' onClick={() => deleteMember(current.id)}
            disabled={isProcessing}>{isProcessing ? 'Removendo..' : 'Tenho certeza'}
            </button>              
          </div>
      
        </div>

      </div>
      <div className={current.action === 'edit' || current.action === 'add' ? 'modal' : 'none'}>
        <div className="modalBox">
          <div className="modalTitle">
          {current.action === 'edit' ? 'Alterar dados' : 'Incluir dados'}
          </div>

          <form className="editMemberForm">
            <label htmlFor="category">Categoria:<input id="category" type="text" onChange={(e) => setCurrent({...current, category: e.target.value})}value={current.category}/></label>
            <label htmlFor="name">Nome:<input id="name" type="text" onChange={(e) => setCurrent({...current, name: e.target.value})}value={current.name}/></label>
            <label htmlFor="job">Função:<input id="job" type="text" onChange={(e) => setCurrent({...current, job: e.target.value})}value={current.job}/></label>
            <label htmlFor="contact">Email:<input id="contact" type="text" onChange={(e) => setCurrent({...current, contact: e.target.value})}value={current.contact}/></label>
            <label htmlFor="contact">Celular:
            <input type="text" placeholder="(DDD) 9xxxx-xxxx"
            onChange={(e) => setCurrent({...current, mobile: e.target.value})} value={current.mobile}/></label>
            <label htmlFor="contact">Foto:
            <input type="text" placeholder="Inserir URL da foto"
            onChange={(e) => setCurrent({...current, image: e.target.value})} value={current.image}/></label>
          </form>
          <div className={authorized ? 'buttonWrapper' : 'none'}>
            <button className="adminBtn"
            onClick={closeModal}>Voltar</button>
            <button  className={current.action === 'add' ? 'adminBtn' : 'none'}
            disabled={isProcessing}
            onClick={addMember}>
              {isProcessing ? 'Salvando..' : 'Confirmar'}
            </button>
            <button  className={current.action === 'edit' ? 'deleteBtn' : 'none'}
            onClick={clickedDelete}>Deletar</button>     
            <button  className={current.action === 'edit' ? 'adminBtn' : 'none'}
            disabled={isProcessing}
            onClick={modifyMember}>
              {isProcessing ? 'Salvando..' : 'Salvar alterações'}
            </button>                    
          </div>
        </div>        
      </div>

      {lista.map((category) => {
        let categoryTitle = "Adicionar à categoria "+category.title;
        return (
        <div className="categoriaEquipe" key={category.title}>
          <div className="buttonWrapper" style={{gap: '20px'}}>
            <h1 className="title">{category.title}</h1>
            <button title={categoryTitle}
            onClick={() => clickedAdd(category.title)}
            className={authorized ? 'addBtn' : 'none'}>+</button>
          </div>
          {category.members.map((member) => {
            return(
              <div className="membroEquipeWrapper" key={member.id}>
                <div className="membroEquipe">
                  <img className='equipeImageReplacer' src={member.image}/>
                  <div className="membroInfo">
                    <h2 className="name" onClick={() => setCard(member)}>{member.name}</h2>
                    <h3 className="job">{member.job}</h3>
                    <p className="contact">{member.contact}</p>
                    <div className={authorized ? 'buttonWrapper' : 'none'}>
                      <button className='adminBtn' id="editBtn"
                      onClick={() => clickedEdit(member)}>Editar</button>
                      <div>
                        <button className='adminBtn' 
                        id="arrowBtnUp" disabled={!isMovingAllowed(member, "decrease")}
                        onClick={() => changePosition(member, 'decrease')}>Up</button>
                        <button className='adminBtn' 
                        id="arrowBtnDown" disabled={!isMovingAllowed(member, "increase")}
                        onClick={() => changePosition(member, 'increase')}>Down</button>                      
                      </div>

                    </div>

                  </div>
                </div>
              </div>
            )
          })}
        </div>)
      })}
      <button className={authorized ? 'none' : "adminBtn"} onClick={() => window.dispatchEvent(new Event('login'))}>Login</button>
      <button className={authorized ? "adminBtn" : 'none'} onClick={handleSignOut}>Logout</button>
      <div className="gap"></div>
    </div>
  );
}

export default Equipe;