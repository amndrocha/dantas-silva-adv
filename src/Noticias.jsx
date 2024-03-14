import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";

function Noticias() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [preview, setPreview] = useState(false);
  const today = new Date().toISOString(); 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({
    id: '',
    title: '',
    content: '',
    createdAt: '',
    image: ''
  });

  const [authorized, setAuthorized] = useState(null);
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setAuthorized(session)
    })

    supabase.auth.onAuthStateChange((_event, session) => {
      setAuthorized(session)
    })
  }, [])
  

  async function getPosts() {
    const { data } = await supabase.from("posts").select();
    setPosts(data);    
  }

  useEffect(() => {
    getPosts();
  }, []);

  const getDate = (date) => {
    let newDate;
    if (date == '') {
      date = today.split('T')[0];
    }
    newDate = date.split('-');
    return newDate[2]+'/'+newDate[1]+'/'+newDate[0];
  }

  const closeModal = () => {
    setNewPost({
      id: '',
      title: '',
      content: '',
      createdAt: '',
      image: ''
    });
    setIsModalOpen(false);
  }

  async function sendPost() {
    setIsProcessing(true);
    try {
      let post = {
        title: newPost.title,
        content: newPost.content,
        image: newPost.image,
        createdAt: today,
      }
      const { data, error } = await supabase
        .from('posts')
        .insert([post])
        .single();
  
      if (error) {
        throw error;
      } 
  
      console.log('New post added successfully:', data);
      setIsProcessing(false);
      closeModal();
      getPosts();      
      return data;
    } catch (error) {
      console.error('Error adding new post:', error.message);
      throw error;
    }
  }

  const deletePost = async () => {
    setIsProcessing(true);
    try {
      setIsProcessing(true);
      const { data, error } = await supabase
        .from("posts")
        .delete()
        .eq('id', newPost.id);
  
      if (error) {
        console.error('Error removing post:', error.message);
      } else {
        console.log('Post deleted successfully:', data);
        getPosts();
      }
    } catch (error) {
      console.error('Error removing post:', error.message);
    } finally {
      setIsProcessing(false);
      closeModal();
      alert('Post removido com sucesso.');
    }
  };

  const modifyPost = async () => {
    try {
      setIsProcessing(true);
      const { data, error } = await supabase
        .from('posts')
        .update({
          title: newPost.title,
          content: newPost.content,
          image: newPost.image,
        })
        .eq('id', newPost.id);
  
      if (error) {
        console.error('Error modifying post:', error.message);
      } else {
        setIsProcessing(false);
        getPosts();
        alert('Alterações salvas com sucesso.');
        console.log('Post modified successfully:', data);
        closeModal();
      }
    } catch (error) {
      console.error('Error modifying post:', error.message);
    }
  };

  window.addEventListener('navigated', () => {
    closeModal();
  });
  

  return (
    <div id="noticiasContent" className="middle">

      <div className={isModalOpen ? 'newPostModal' : 'none'}>
        <div className="buttonWrapper" style={{marginTop: '10px'}}>
          <label htmlFor="" style={{whiteSpace: "nowrap"}}>Img URL: <input type="text" value={newPost.image} onChange={(e) => setNewPost({...newPost, image: e.target.value})}/></label>  
        </div>
        
        <div  className={preview? 'none' : 'postInput'}>
          <div className="postInfo">
            <input type="text" placeholder="Título" className="inputPostTitle" 
            value={newPost.title} onChange={(e) => setNewPost({...newPost, title: e.target.value})}
            />
          </div>

          <textarea className="inputPostContent" placeholder="Insira conteúdo do post"
          value={newPost.content} onChange={(e) => setNewPost({...newPost, content: e.target.value})}
          />         
        </div>

        <div className={preview ? "postInput" : 'none'} style={{overflowY: 'auto'}}>
          <div className="postInfo">
              <h1 className="postTitle">{newPost.title == '' ? 'Título' : newPost.title}</h1>
              <h2>{getDate('')}</h2>                    
          </div>
          <div className="postBox"><img className={newPost.image !== '' ? "floatImage" : 'none'} src={newPost.image}/><span className="textSpan" dangerouslySetInnerHTML={{__html: newPost.content}}></span></div>
        </div>         
        <div className="buttonWrapper" style={{marginBottom: '10px'}}>
          <button className="adminBtn" onClick={closeModal}>Voltar</button>
          
          <button className="adminBtn" onClick={() => alert("<b>Texto em negrito</b>\n<i>Texto em itálico</i>\n<a href='url.com'>Texto do hiperlink</a>")}>Dicas</button>
          <button className="adminBtn" onClick={() => setPreview(!preview)}>{preview ? 'Editar' : 'Preview'}</button>
          <button className={newPost.id ? 'none' : 'adminBtn'} onClick={sendPost} disabled={isProcessing}>{isProcessing ? 'Enviando...' : 'Enviar'}</button>
          <button className={newPost.id ? 'adminBtn' : 'none'} onClick={modifyPost} disabled={isProcessing}>{isProcessing ? 'Salvando...' : 'Salvar alterações'}</button>       
        </div>        
      </div>

      <div className="gap" style={{height: '0'}}></div>
      <h1 className={newPost.id == '' ? "title" : 'none'}>Notícias</h1>
      <div className={newPost.id !== '' || authorized ? "buttonWrapper" : 'none'}>
        <button className={newPost.id == '' ? 'none' : 'adminBtn'} onClick={closeModal}>Voltar</button>
        <button onClick={deletePost}
        className={authorized && newPost.id !== '' ? 'deleteBtn' : 'none'}
        disabled={isProcessing}>{isProcessing ? 'Deletando...' : 'Deletar'}</button> 
        <button onClick={() => setIsModalOpen(true)} className={authorized ? 'adminBtn' : 'none'}>{newPost.id == '' ? 'Novo post' : 'Editar'}</button> 
      </div>

  
      <div className='posts'>

        <div className={newPost.id == '' ? 'none' : 'post'} style={{width: '100%', height: 'fit-content', overflow: "hidden", marginBottom: '20px'}}>
            <div className="postInfo">
                <h1 className="postTitle">{newPost.title}</h1>
                <h2>{newPost.createdAt}</h2>                    
            </div>
            <div className="postBox"><img className="floatImage" src={newPost.image}/><span className="textSpan" dangerouslySetInnerHTML={{__html: newPost.content}}></span></div>
        </div>

        {posts.map(post => (
          <div  className={newPost.id == '' ? 'postPreview' : 'none'} key={post.id}
          onClick={() => setNewPost({id: post.id, title: post.title, content: post.content, image: post.image, createdAt: post.createdAt,})}>
            <img className="postPreviewImage" src={post.image ? post.image : './img/blank.png'}/>
            <div className="postInfoPreview">
              <h2 className="name" style={{borderBottom: '1px solid grey'}}>{post.title}</h2>
              <h3 >{getDate(post.createdAt)}</h3>
              <div className="postBoxPreview"><span className="textSpanPreview" dangerouslySetInnerHTML={{__html: post.content}}></span></div>                    
            </div>  
        </div>
        ))}      
      </div>
    </div>
  );
}

export default Noticias;
