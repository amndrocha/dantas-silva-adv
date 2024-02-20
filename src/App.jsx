import { useEffect, useState } from "react";
import Equipe from "./Equipe";
import './App.css';
import Login from "./Login";
import { supabase } from './supabaseClient';
import Escritorio from "./Escritorio";

function App() {

  const [loading, setLoading] = useState(true);
  const [images, setImages] = useState([]);

  async function getImages() {
    const { data } = await supabase.from("images").select();
    setImages(data);
    setLoading(false);
  }

  useEffect(() => {
    getImages();
  }, []);

  const [currentImage, setCurrentImage] = useState({
    id: '',
    url: '',
  });

  const getUrl = (id) => {
    const image = images.find(img => img.id === id);
    return image ? image.url : '';
  };

  const [current, setCurrent] = useState('home');
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    document.getElementById('equipeContent').scrollTo(0,0);
    document.getElementById('escritorioContent').scrollTo(0,0);
  }, [current]);

  const openModal = (id) => {
    let element = document.getElementById(id);
    let url = '';
    if (element.nodeName === 'IMG') {
      url = element.src;
    } else {
      url = element.style.backgroundImage.slice(4, -1).replace(/"/g, "");
    }
    setCurrentImage({
      id: id,
      url: url,
    });
    setIsModalOpen(true);
  }

  const closeModal = () => {
    setCurrentImage({
      id: '',
      url: '',
    });    
    setIsModalOpen(false);
  }

  const changeImage = async () => {
    try {
      setIsProcessing(true);
      const { data, error } = await supabase
        .from('images')
        .update({
          url: currentImage.url,
        })
        .eq('id', currentImage.id);
  
      if (error) {
        console.error('Error updating image:', error.message);
      } else {
        getImages();
        console.log('Image updated successfully:', data);
        setIsProcessing(false);
        closeModal();
      }
    } catch (error) {
      console.error('Error updating image:', error.message);
    }
  };

  const getPreviousUrl = () => {
    const image = images.find(img => img.id === currentImage.id);
    if (image !== '') {
      setCurrentImage({
        ...currentImage,
        url: image.previous,
      });
    } else {
      setCurrentImage({
        ...currentImage,
        url: '',
      });
    }
  };

  function Content() {
    if (current === "home") {
      return(        
        <div style={{overflow: "hidden"}} className="middle">
            <div id="indexImages">

                <div className="indexImageBox" id="indexImageBox1"
                style={{backgroundImage: "url("+getUrl("indexImageBox1")+")"}}>
                  <button onClick={() => openModal("indexImageBox1")}
                  style={{margin: '10px'}}
                  className='adminBtn'>{getUrl('indexImageBox1') === '' ? 'Incluir foto' : 'Alterar'}</button>
                </div>

                <div className="indexImageBox" id="indexImageBox2"
                style={{backgroundImage: "url("+getUrl("indexImageBox2")+")"}}>
                  <button onClick={() => openModal("indexImageBox2")}
                  style={{margin: '10px'}}
                  className='adminBtn'>{getUrl('indexImageBox2') === '' ? 'Incluir foto' : 'Alterar'}</button>
                </div>

                <div className="indexImageBox" id="indexImageBox3"
                style={{backgroundImage: "url("+getUrl("indexImageBox3")+")"}}>
                  <button onClick={() => openModal("indexImageBox3")}
                  style={{margin: '10px'}}
                  className='adminBtn'>{getUrl('indexImageBox3') === '' ? 'Incluir foto' : 'Alterar'}</button>
                </div>

            </div>
        </div>
      )
    } else if (current === "areas"){
      return(
        <div id="areasContent" className="middle">
            <h1>Áreas de atuação</h1>
            <div id="areasRow">
                <div className="areasColumn">
                    <div id="areasImageBox1" className="areasImageBox" style={{backgroundImage: "url("+getUrl("areasImageBox1")+")"}}>
                      <button onClick={() => openModal("areasImageBox1")}
                      style={{margin: '10px'}}
                      className='adminBtn'>{getUrl('areasImageBox1') === '' ? 'Incluir foto' : 'Alterar'}</button>
                    </div>
                    <ul>
                        <li>Seguro e Capitalização</li><hr/>
                        <li>Transporte</li><hr/>
                        <li>Responsabilidade Civil</li><hr/>
                        <li>Acidente de Trânsito</li><hr/>
                        <li>Energia</li>
                    </ul>
                </div>
                <div id="areasColumn2" className="areasColumn">
                    <ul>
                        <li>Consumidor</li><hr/>
                        <li>Bancário</li><hr/>
                        <li>Cobrança</li><hr/>
                        <li>Trabalhista</li><hr/>
                        <li>Imobiliário</li>
                    </ul>
                    <div id="areasImageBox2" className="areasImageBox" style={{backgroundImage: "url("+getUrl("areasImageBox2")+")"}}>
                      <button onClick={() => openModal("areasImageBox2")}
                      style={{margin: '10px'}}
                      className='adminBtn'>{getUrl('areasImageBox2') === '' ? 'Incluir foto' : 'Alterar'}</button>
                    </div>
                </div>
                <div className="areasColumn">
                    <div id="areasImageBox3" className="areasImageBox" style={{backgroundImage: "url("+getUrl("areasImageBox3")+")"}}>
                      <button onClick={() => openModal("areasImageBox3")}
                      style={{margin: '10px'}}
                      className='adminBtn'>{getUrl('areasImageBox3') === '' ? 'Incluir foto' : 'Alterar'}</button>
                    </div>
                    <ul>
                        <li>Empresarial</li><hr/>
                        <li>Contratual</li><hr/>
                        <li>Ambiental</li><hr/>
                        <li>Família</li><hr/>
                        <li>Órfãos e sucessões</li>
                    </ul>
                </div>
            </div>            
        </div>
      )
    } else if (current === "login") {
      return (
        <div className="middle">
          <Login/>
          <button onClick={() => localStorage.clear()}>Limpar</button>
        </div>
      )
    } else if (current === "noticias") {
      return (
        <div className="middle">
        </div>
      )
    }
  }  

  return (
    <div className="App">
      <div style={{backgroundColor: "blue", height: "fit-content"}}>
          <div id="altDecoBox" className="decoBox"></div>
          <div className="navegation">
              <img id="logo" src="img\logo.png" onClick={() => setCurrent('home')}/>
              <img id="menuLink" href="menu.html" className="navLink" src="img\menu.svg"/>
              <div id="horizontalNav">
                  <a className="navLink" onClick={() => setCurrent('escritorio')}>Escritório</a>
                  <div className="divider">⏐</div>
                  <a className="navLink" onClick={() => setCurrent('equipe')}>Equipe</a>
                  <div className="divider">⏐</div>
                  <a className="navLink"  onClick={() => setCurrent('areas')}>Atuação</a>
                  <div className="divider">⏐</div>
                  <a className="navLink" onClick={() => setCurrent('noticias')}>Notícias</a>
                  <div className="divider">⏐</div>
                  <a className="navLink" onClick={() => setCurrent('login')}>Acesso</a>
              </div>
          </div>
      </div>

      <span className={loading || current === 'equipe' ? 'visible' : 'none'}><Equipe/></span>
      <span className={loading || current === 'escritorio' ? 'visible' : 'none'}><Escritorio/></span>

      <Content/>
      
      <div className={isModalOpen ? 'modal' : 'none'}>
        <div className="modalBox">
          <form className="editMemberForm">
            <label htmlFor="contact">URL da foto:
            <input id="image" type="text" onChange={(e) => setCurrentImage({...currentImage, url: e.target.value})}
            value={currentImage.url}/></label>
        </form>

          <div className="buttonWrapper">
            <button onClick={closeModal}
            className='adminBtn'>Voltar</button>
            <button  className='adminBtn' onClick={getPreviousUrl}>Resetar</button> 
            <button  className='adminBtn' onClick={changeImage}
            disabled={isProcessing}>{isProcessing ? 'Salvando..' : 'Salvar alterações'}
            </button>              
          </div>      
        </div>
      </div>

      <div id="footer">
          <div id="address">
              <div className="addressItem">Rua da Quitanda, 60, 12º andar</div>
              <div className="addressItem">Rio de Janeiro/RJ, Brasil - CEP 20011-030</div>
          </div>
          <p className="addressItem" style={{textAlign: "center"}}>+55 (21) 3078-3363 - advogados@dantassilva.com.br </p>
      </div>

      <div id="copyright"><b>Copyright</b> © Dantas Silva Advogados Associados. Todos os direitos reservados.</div>
      
      <div className={loading ? 'fullScreen' : 'none'}><div className="loader"></div></div>
      {/* <div className="mobileMenu">
        <div id="returnBtn">
          <a href="javascript:history.back()">
            <svg width="10vh" height="10vh" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 12H20M4 12L8 8M4 12L8 16" stroke="#ffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </a>
        </div>            
        <div className="verticalNav">
          <a href="index.html" className="navLink">Página Inicial</a>
          <a href="escritorio.html" className="navLink">Escritório</a>
          <a href="areas.html" className="navLink">Atuação</a>
          <a href="equipe.html" className="navLink">Equipe</a>
          <a href="noticias.html" className="navLink">Notícias</a>
          <a href="" className="navLink">Acesso Remoto</a>
        </div>
      </div>         */}
    </div>
  );
}

export default App;