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

  const reorderEquipe = async () => {
    // Step 1: Group members by category
    const groupedEquipe = {
        'Sócio': [],
        'Jurídico': [],
        'Administrativo': []
    };

    equipe.forEach(member => {
        groupedEquipe[member.category].push(member);
    });

    // Step 2: Sort members within each category by name
    // for (const category in groupedEquipe) {
    //     groupedEquipe[category].sort((a, b) => a.name.localeCompare(b.name));
    // }

    // Step 3: Combine sorted members back into a single array
    const reorderedEquipe = [
        ...groupedEquipe['Sócio'],
        ...groupedEquipe['Jurídico'],
        ...groupedEquipe['Administrativo']
    ];

    // Update the order field based on the new index
    reorderedEquipe.forEach(async (member, index) => {
        member.order = index;
        // Update the database with the new order
        try {
            await supabase
                .from('equipe')
                .update({ order: index })
                .eq('id', member.id);
            console.log('Database updated successfully'); // Log statement for successful update
        } catch (error) {
            console.error('Error updating member order:', error.message);
        }
    });

    // Update the state with the reordered equipe array
    setEquipe(reorderedEquipe);
};

  
  

  useEffect(() => {
    getEquipe();
  }, []);

  async function getEquipe() {
    const { data } = await supabase.from("equipe").select();
    setEquipe(data.sort((a, b) => a.order - b.order));
  }

  let categories = [];

  equipe.map((member) => {
    if (!categories.includes(member.category)) {
      categories.push(member.category)
    }
  })

  let reordered = false;
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

  function clickedAdd(category) {
    setCurrent({
      id: current.id,
      category: category,
      name: current.name,
      contact: current.contact,
      job: current.job,
      image: current.image,
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
        setEquipe(prevEquipe => prevEquipe.filter(member => member.id !== current.id));
      }
    } catch (error) {
      console.error('Error removing row:', error.message);
    } finally {
      setIsProcessing(false);
      closeModal();
      alert('Dados removidos com sucesso.');
    }
  };

  const modifyMember = async () => {
    try {
      setIsProcessing(true);
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
      setIsProcessing(false);
      closeModal();
      alert('Alterações salvas com sucesso.');
    }
  };

  const addMember = async (newMember) => {
    try {
      // Perform the addition operation here
      const { data, error } = await supabase
        .from('equipe')
        .insert({
          category: current.category,
          name: current.name,
          job: current.job,
          contact: current.contact,
          image: current.image,
          order: equipe.length,
        });
  
      if (error) {
        console.error('Error adding member:', error.message);
      } else {
        console.log('Member added successfully:', data);
        setEquipe(prevEquipe => [...prevEquipe, newMember]);
      }
    } catch (error) {
      console.error('Error adding member:', error.message);
    } finally {
      setIsProcessing(false);
      closeModal();
      alert('Dados incluídos com sucesso.');
    }
  };
  
  const changePosition = async (memberId, direction) => {
    // Find the member by ID
    const member = equipe.find(member => member.id === memberId);
    if (!member) {
        console.error('Member not found');
        return;
    }

    // Find other members in the same category
    const sameCategoryMembers = equipe.filter(m => m.category === member.category);
    // Sort members by order property
    sameCategoryMembers.sort((a, b) => a.order - b.order);

    // Find the index of the current member in the sorted list
    const currentIndex = sameCategoryMembers.findIndex(m => m.id === memberId);

    let newOrder;
    if (direction === 'increase') {
        // Check if it's already at the last position or if the next member is from a different category
        if (currentIndex === sameCategoryMembers.length - 1 || sameCategoryMembers[currentIndex].order + 1 !== sameCategoryMembers[currentIndex + 1].order) {
            console.error('Cannot increase order further');
            return;
        }
        newOrder = member.order + 1;
    } else if (direction === 'decrease') {
        // Check if it's already at the first position or if the previous member is from a different category
        if (currentIndex === 0 || sameCategoryMembers[currentIndex].order - 1 !== sameCategoryMembers[currentIndex - 1].order) {
            console.error('Cannot decrease order further');
            return;
        }
        newOrder = member.order - 1;
    }

    // Update the order property of all members in the same category
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

    // Update the database with the new order
    try {
        await Promise.all(updatedMembers.map(async m => {
            await supabase
                .from('equipe')
                .update({ order: m.order })
                .eq('id', m.id);
        }));
        console.log('Order property updated successfully');
    } catch (error) {
        console.error('Error updating order property:', error.message);
    }
};




  
  
  const logEquipe = () => {
    let log = equipe.map(member => {
      console.log(member.order+' '+member.category+' '+member.name)
    })
  }
  
  
  return (
    <div id="equipeContent" className="middle">
      <button onClick={logEquipe}>Log equipe</button>
      <button onClick={reorderEquipe}>Reorder equipe</button>
      <div className={current.action === 'delete' ? 'modal' : 'none'}>
        <div className="modalBox">
          Tem certeza que deseja deletar {current.name} do banco de dados?
          <br/>
          Essa ação é irreversível.
          <div className="buttonWrapper">
            <button  className='adminBtn'
            onClick={() => clickedEdit(current)}>Voltar</button>
            <button  className='adminBtn'
            onClick={() => deleteMember(current.id)}
            disabled={isProcessing}>{isProcessing ? 'Removendo..' : 'Tenho certeza'}</button>              
          </div>
      
        </div>

      </div>
      <div className={current.action === 'edit' || current.action === 'add' ? 'modal' : 'none'}>
        <div className="modalBox">
          <div className="modalTitle">
          {current.action === 'edit' ? 'Alterar dados' : 'Incluir dados'}
          </div>

          <form className="editMemberForm">
            <label for="name">Categoria:<input id="category" type="text" onChange={(e) => setCurrent({...current, category: e.target.value})}value={current.category}/></label>
            <label for="name">Nome:<input id="name" type="text" onChange={(e) => setCurrent({...current, name: e.target.value})}value={current.name}/></label>
            <label for="job">Função:<input id="job" type="text" onChange={(e) => setCurrent({...current, job: e.target.value})}value={current.job}/></label>
            <label for="contact">Contato:<input id="contact" type="text" onChange={(e) => setCurrent({...current, contact: e.target.value})}value={current.contact}/></label>
            <label for="contact" className={current.action === 'add' ? 'visible' :  'none'}>Foto:
            <input id="image" type="text" placeholder="Inserir URL da foto"
            onChange={(e) => setCurrent({...current, image: e.target.value})}value={current.image}/></label>
          </form>
          <div className="buttonWrapper">
            <button className="adminBtn"
            onClick={closeModal}>Voltar</button>
            <button  className={current.action === 'add' ? 'adminBtn' : 'none'}
            disabled={isProcessing}
            onClick={addMember}>
              {isProcessing ? 'Salvando..' : 'Confirmar'}
            </button>
            <button  className={current.action === 'edit' ? 'adminBtn' : 'none'} id="deleteBtn"
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
              <div className="membroEquipeWrapper">
                <div className="membroEquipe" key={member.id}>
                  <img className="equipeImage" src={member.image === '' ? 'img/blank.png' : member.image}/>
                  <div className="membroInfo">
                    <h2 className="name">{member.name}</h2>
                    <h3 className="job">{member.job}</h3>
                    <p className="contact">{member.contact}</p>
                    <div className="buttonWrapper">
                      <button className={authorized ? 'adminBtn' : 'none'} id="editBtn"
                      onClick={() => clickedEdit(member)}>Editar</button>
                      <div>
                        <button className={authorized ? 'adminBtn' : 'none'} id="arrowBtnUp"
                        onClick={() => changePosition(member.id, 'decrease')}>Up</button>
                        <button className={authorized ? 'adminBtn' : 'none'} id="arrowBtnDown"
                        onClick={() => changePosition(member.id, 'increase')}>Down</button>                      
                      </div>

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