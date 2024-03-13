import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";

function Noticias() {
  const [isProcessing, setIsProcessing] = useState(false);
  const today = new Date().toISOString();
  const authorized = localStorage.getItem('auth');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({
    id: '',
    title: '',
    content: '',
    createdAt: '',
    image: ''
  });
  

  async function getPosts() {
    const { data } = await supabase.from("posts").select();
    setPosts(data);    
    //console.log(posts);
    //console.log(newPost);
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

  const handleEditPost = (post) => {
    setNewPost(post);
    setIsModalOpen(true);
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

  

  return (
    <div id="noticiasContent" className="middle">

      <div className={isModalOpen ? 'newPostModal' : 'none'}>
        <div style={{display: 'flex', gap: '30px'}}>
          <div className="post" style={{width: '40vw', height: '80vh', overflowY: 'scroll'}}>
            <div className="postInfo">
              <input type="text" placeholder="Título" className="inputPostTitle" 
              value={newPost.title} onChange={(e) => setNewPost({...newPost, title: e.target.value})}
              />
              <h2>{getDate('')}</h2>  
            </div>

            <textarea className="inputPostContent" placeholder="Insira conteúdo do post"
            value={newPost.content} onChange={(e) => setNewPost({...newPost, content: e.target.value})}
            />
          </div>

          <div className="post" style={{width: '40vw', height: '80vh', overflowY: 'scroll'}}>
              <div className="postInfo">
                  <h1 className="postTitle">{newPost.title == '' ? 'Título' : newPost.title}</h1>
                  <h2>{getDate('')}</h2>                    
              </div>
              <div className="postBox"><img className="postImage" src={newPost.image}/><span className="textSpan" dangerouslySetInnerHTML={{__html: newPost.content}}></span></div>
          </div>          
        </div>
        <div className="buttonWrapper">
          <button className="adminBtn" onClick={closeModal}>Voltar</button>
          <div className="buttonWrapper">
            <label htmlFor="">URL da imagem: <input type="text" value={newPost.image} onChange={(e) => setNewPost({...newPost, image: e.target.value})}/></label>  
          </div>
          <button className="adminBtn" onClick={() => alert("<b>Texto em negrito</b>\n<i>Texto em itálico</i>\n<a href='url.com'>Texto do hiperlink</a>")}>Dicas</button>
          <button className="adminBtn" onClick={sendPost} disabled={isProcessing}>{isProcessing ? 'Enviando...' : 'Enviar'}</button>          
        </div>


        
      </div>
      <div className="buttonWrapper">
        <button className={newPost.id == '' ? 'none' : 'adminBtn'} onClick={closeModal}>Voltar</button>
        <button onClick={() => setIsModalOpen(true)} id='deleteBtn'
        className={authorized && newPost.id !== '' ? 'adminBtn' : 'none'}disabled={isProcessing}>{isProcessing ? 'Deletando...' : 'Deletar'}</button> 
        <button onClick={() => setIsModalOpen(true)} className={authorized ? 'adminBtn' : 'none'}>{newPost.id == '' ? 'Novo post' : 'Editar'}</button> 
      </div>

  
      <div className='posts'>

        <div className={newPost.id == '' ? 'none' : 'post'} style={{width: '100%', height: 'fit-content'}}>
            <div className="postInfo">
                <h1 className="postTitle">{newPost.title}</h1>
                <h2>{newPost.createdAt}</h2>                    
            </div>
            <div className="postBox"><img className="postImage" src={newPost.image}/><span className="textSpan" dangerouslySetInnerHTML={{__html: newPost.content}}></span></div>
        </div>

        {posts.map(post => (
          <div  className={newPost.id == '' ? 'postPreview' : 'none'} key={post.id}
          onClick={() => setNewPost({id: post.id, title: post.title, content: post.content, image: post.image, createdAt: post.createdAt,})}>
            <img className="postPreviewImage" src={post.image ? post.image : './img/blank.png'}/>
            <div style={{width: '100%'}}>
              <div className="postInfo">
                  <h1 className="postTitle">{post.title}</h1>
                  <h2>{getDate(post.createdAt)}</h2>                    
              </div>
              <div className="postBoxPreview"><span className="textSpanPreview" dangerouslySetInnerHTML={{__html: post.content}}></span></div>                
            </div>
        </div>
        ))}        
      </div>
    </div>
  );
}

export default Noticias;
