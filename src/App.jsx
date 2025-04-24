import { useEffect, useState } from "react";
import Equipe from "./Equipe";
import './App.css';
import { supabase } from './supabaseClient';
import Noticias from "./Noticias";
import Auth from "./Auth";

function App() {

  const [loading, setLoading] = useState(true);
  const [images, setImages] = useState([]);
  const [areas, setAreas] = useState([]);
  const [current, setCurrent] = useState('home');
  const [isProcessing, setIsProcessing] = useState(false); 
  const [openMenu, setOpenMenu] = useState(false); 

  const [authorized, setAuthorized] = useState(null);
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setAuthorized(session)
    })

    supabase.auth.onAuthStateChange((_event, session) => {
      setAuthorized(session)
    })
  }, [])

  async function getImages() {
    const { data } = await supabase.from("images").select();
    setImages(data);
    setLoading(false);
  }

  async function getAreas() {
    const { data } = await supabase.from("areas").select();
    setAreas(data);
    setLoading(false);
  }

  useEffect(() => {
    getImages();
    getAreas();
  }, []);

  useEffect(() => {
    document.getElementById('equipeContent').scrollTo(0,0);
    document.getElementById('escritorioContent').scrollTo(0,0);
    document.getElementById('noticiasContent').scrollTo(0,0);
    document.getElementById('contentWrapper').scrollTo(0,0);
    window.scrollTo(0,0);
    window.dispatchEvent(new Event('navigated'));
    setOpenMenu(false);
  }, [current]);

  window.addEventListener('login', () => {
    setCurrent('login');
  });

  window.addEventListener('logged', () => {
    setCurrent('home');
  });

  const [currentImage, setCurrentImage] = useState({
    id: '',
    url: '',
  });

  const [currentArea, setCurrentArea] = useState({
    id: '',
    title: '',
    description: '',
    view: false,
  });

  const getUrl = (id) => {
    const image = images.find(img => img.id === id);
    return image ? image.url : '';
  };

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
  }

  const closeModal = () => {
    setCurrentImage({
      id: '',
      url: '',
    });    
    setCurrentArea({
      id: '',
      title: '',
      description: '',
      view: false
    });    
  }

  const changeArea = async () => {
    try {
      setIsProcessing(true);
      const { data, error } = await supabase
        .from('areas')
        .update({
          title: currentArea.title,
          description: currentArea.description,
        })
        .eq('id', currentArea.id);
  
      if (error) {
        console.error('Error updating area:', error.message);
      } else {
        getAreas();
        console.log('Area updated successfully:', data);
        setIsProcessing(false);
        setCurrentArea({...currentArea, view: true});
      }
    } catch (error) {
      console.error('Error updating area:', error.message);
    }
  };

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
                  className={authorized ? 'adminBtn' : 'none'}>{getUrl('indexImageBox1') === '' ? 'Incluir foto' : 'Alterar'}</button>
                </div>

                <div className="indexImageBox" id="indexImageBox2"
                style={{backgroundImage: "url("+getUrl("indexImageBox2")+")"}}>
                  <button onClick={() => openModal("indexImageBox2")}
                  style={{margin: '10px'}}
                  className={authorized ? 'adminBtn' : 'none'}>{getUrl('indexImageBox2') === '' ? 'Incluir foto' : 'Alterar'}</button>
                </div>

                <div className="indexImageBox" id="indexImageBox3"
                style={{backgroundImage: "url("+getUrl("indexImageBox3")+")"}}>
                  <button onClick={() => openModal("indexImageBox3")}
                  style={{margin: '10px'}}
                  className={authorized ? 'adminBtn' : 'none'}>{getUrl('indexImageBox3') === '' ? 'Incluir foto' : 'Alterar'}</button>
                </div>

            </div>
        </div>
      )
    } else if (current === "areas"){
      return(
        <div id="areasContent" className="middle">
          <div className="gap" style={{height: '0px'}}></div>
            <h1>Áreas de atuação</h1>
            <div id="areasRow">
                <div className="areasColumn">
                    <div id="areasImageBox1" className="areasImageBox" style={{backgroundImage: "url("+getUrl("areasImageBox1")+")"}}>
                      <button onClick={() => openModal("areasImageBox1")}
                      style={{margin: '10px'}}
                      className={authorized ? 'adminBtn' : 'none'}>{getUrl('areasImageBox1') === '' ? 'Incluir foto' : 'Alterar'}</button>
                    </div>
                    <ul>
                        <li onClick={() => setCurrentArea({id: 0, title: areas[0].title, description: areas[0].description, view: true})}>{areas[0].title}</li>
                        <li onClick={() => setCurrentArea({id: 1, title: areas[1].title, description: areas[1].description, view: true})}>{areas[1].title}</li>
                        <li onClick={() => setCurrentArea({id: 2, title: areas[2].title, description: areas[2].description, view: true})}>{areas[2].title}</li>
                        <li onClick={() => setCurrentArea({id: 3, title: areas[3].title, description: areas[3].description, view: true})}>{areas[3].title}</li>
                        <li onClick={() => setCurrentArea({id: 4, title: areas[4].title, description: areas[4].description, view: true})}>{areas[4].title}</li>
                    </ul>
                </div>
                <div id="areasColumn2" className="areasColumn">
                    <ul>
                        <li onClick={() => setCurrentArea({id: 5, title: areas[5].title, description: areas[5].description, view: true})}>{areas[5].title}</li>
                        <li onClick={() => setCurrentArea({id: 6, title: areas[6].title, description: areas[6].description, view: true})}>{areas[6].title}</li>
                        <li onClick={() => setCurrentArea({id: 7, title: areas[7].title, description: areas[7].description, view: true})}>{areas[7].title}</li>
                        <li onClick={() => setCurrentArea({id: 8, title: areas[8].title, description: areas[8].description, view: true})}>{areas[8].title}</li>
                        <li onClick={() => setCurrentArea({id: 9, title: areas[9].title, description: areas[9].description, view: true})}>{areas[9].title}</li>
                    </ul>
                    <div id="areasImageBox2" className="areasImageBox" style={{backgroundImage: "url("+getUrl("areasImageBox2")+")"}}>
                      <button onClick={() => openModal("areasImageBox2")}
                      style={{margin: '10px'}}
                      className={authorized ? 'adminBtn' : 'none'}>{getUrl('areasImageBox2') === '' ? 'Incluir foto' : 'Alterar'}</button>
                    </div>
                </div>
                <div className="areasColumn">
                    <div id="areasImageBox3" className="areasImageBox" style={{backgroundImage: "url("+getUrl("areasImageBox3")+")"}}>
                      <button onClick={() => openModal("areasImageBox3")}
                      style={{margin: '10px'}}
                      className={authorized ? 'adminBtn' : 'none'}>{getUrl('areasImageBox3') === '' ? 'Incluir foto' : 'Alterar'}</button>
                    </div>
                    <ul>
                        <li onClick={() => setCurrentArea({id: 10, title: areas[10].title, description: areas[10].description, view: true})}>{areas[10].title}</li>
                        <li onClick={() => setCurrentArea({id: 11, title: areas[11].title, description: areas[11].description, view: true})}>{areas[11].title}</li>
                        <li onClick={() => setCurrentArea({id: 12, title: areas[12].title, description: areas[12].description, view: true})}>{areas[12].title}</li>
                        <li onClick={() => setCurrentArea({id: 13, title: areas[13].title, description: areas[13].description, view: true})}>{areas[13].title}</li>
                        <li onClick={() => setCurrentArea({id: 14, title: areas[14].title, description: areas[14].description, view: true})}>{areas[14].title}</li>
                    </ul>
                </div>
            </div>
            <div className="gap"></div>           
        </div>
      )
    } else if (current === "login") {
      return (
        <div className="middle">
          <Auth/>
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
              <div id="menuLink" onClick={() => setOpenMenu(!openMenu)} className="navLink">☰</div>
              <div id="horizontalNav">
                  <a className={current == 'escritorio' ? 'navLinkSelected' : "navLink"} onClick={() => setCurrent('escritorio')}>Escritório</a>
                  <div className="divider">⏐</div>
                  <a className={current == 'equipe' ? 'navLinkSelected' : "navLink"} onClick={() => setCurrent('equipe')}>Equipe</a>
                  <div className="divider">⏐</div>
                  <a className={current == 'areas' ? 'navLinkSelected' : "navLink"}  onClick={() => setCurrent('areas')}>Atuação</a>
                  <div className="divider">⏐</div>
                  <a className={current == 'noticias' ? 'navLinkSelected' : "navLink"} onClick={() => setCurrent('noticias')}>Notícias</a>
                  <div className="divider">⏐</div>
                  <a className="navLink" href="https://dantassilva.com.br/sigds.asp" target="_blank">Acesso</a>
              </div>
          </div>
      </div>

      <div id="contentWrapper" className="contentWrapper">
        <span className={loading || current === 'equipe' ? 'visible' : 'none'}><Equipe/></span>
        <span className={loading || current === 'escritorio' ? 'visible' : 'none'}>
            <div id="escritorioContent" className="middle">
              <div className="gap" style={{height: 0}}></div> 
              <h1>O Escritório</h1>
              <div id="textBox">
                  <div id="escritorioImage" className="floatImage" style={{backgroundImage: "url("+getUrl("escritorioImage")+")"}}>
                    <button onClick={() => openModal("escritorioImage")}
                    style={{margin: '10px'}}
                    className={authorized ? 'adminBtn' : 'none'}>{getUrl('escritorioImage') === '' ? 'Incluir foto' : 'Alterar'}</button>
                  </div>          
                  <p className="paragraph">Dantas Silva Advogados iniciou suas atividades em 1989 com os sócios Nilton Pereira da Silva e Jorge Antonio Dantas Silva, oriundos do mercado segurador. </p> <p className="paragraph">Em 1996 foi formalmente constituída a sociedade, que hoje está estabelecida à Rua da Quitanda, nº 60 – 12º andar, no Centro do Rio de Janeiro. </p> <p className="paragraph">Atuamos em todo o país por meio de nossas modernas instalações e de nossos profissionais altamente qualificados. Todos com vínculo empregatício, trabalhando com equipamentos de informática modernos e sistema próprio do escritório. </p> <p className="paragraph">Estamos prontos para atender nossos clientes do meio empresarial e pessoas físicas, seja pela modalidade presencial ou virtual. </p> <p className="paragraph">Prezamos pela ética, pela transparência e profissionalismo, com objetividade, simplicidade, rapidez e um custo equilibrado. </p> <p className="paragraph">Nossa proposta é de negociação e resolução de conflitos pela via suasória, inclusive quando em litígio judicial. </p> <p className="paragraph">Ao logo de mais de três décadas, vimos trazendo soluções diferenciadas, com projetos e propostas inovadoras, obedecendo aos interesses de nossos clientes e visando o melhor resultado para solução de seus problemas. </p> <p className="paragraph">Nosso ambiente é acolhedor e traz aos profissionais que atuam uma tranquilidade e segurança para o bom desenvolvimento de suas atividades, assim como para o recebimento de nossos clientes. </p> <p className="paragraph">Esta é nossa forma de trabalhar e nossa proposta, as quais se inserem em nossos ideais e em na razão de existir. </p>
                  <p className="sign" style={{width: "100%", textAlign: "end", marginTop: "10px"}}>Jorge Antonio Dantas Silva</p>
              </div>
            <div className="gap"></div> 
          </div>
        </span>
        <span className={loading || current === 'noticias' ? 'visible' : 'none'}><Noticias/></span>
        <Content/>
        <div id="footer">
            <a id="address" href="https://maps.app.goo.gl/ySznSRfEZuU6obLj6" target="_blank">
                <div className="addressItem">Rua da Quitanda, 60, 12º andar</div>
                <div className="footer-info">
                  <div className="addressItem" id="addressItemFixed">Rio de Janeiro/RJ, Brasil</div>
                  <div className="addressItem">CEP 20011-030 <img style={{height: '12px', opacity: '0.5', filter: 'invert(1)'}} src="./img/map.svg"/></div>  
                </div>                
            </a>
            <div className="desktopRow">
              <div className="addressItem" style={{textAlign: "center"}}>advogados@dantassilva.net.br </div>
              <div className="addressItem" style={{textAlign: "center"}}>+55 (21) 3078-3363</div>
            </div>
            <div id="copyright"><b style={{color: 'rgb(255, 255, 255, 0.4)'}}>Copyright</b> © Dantas Silva Advogados Associados. Todos os direitos reservados.</div>
        </div>        
      </div>



      <div className={currentImage.id !== '' ? 'modal' : 'none'}>
        <div className="modalBox">
          <form className="editMemberForm">
            <label htmlFor="contact">URL da foto:
            <input type="text" onChange={(e) => setCurrentImage({...currentImage, url: e.target.value})}
            value={currentImage.url}/></label>
          </form>

          <div className="buttonWrapper">
            <button onClick={closeModal}
            className={authorized ? 'adminBtn' : 'none'}>Voltar</button>
            <button  className={authorized ? 'adminBtn' : 'none'} onClick={getPreviousUrl}>Resetar</button> 
            <button  className={authorized ? 'adminBtn' : 'none'} onClick={changeImage}
            disabled={isProcessing}>{isProcessing ? 'Salvando..' : 'Salvar alterações'}
            </button>              
          </div>      
        </div>
      </div>

      <div className={currentArea.id !== '' && currentArea.view === false ? 'modal' : 'none'}>
        <div className="modalBox">
          <form className="editMemberForm">
            <label htmlFor="contact">Título:
            <input type="text" onChange={(e) => setCurrentArea({...currentArea, title: e.target.value})}
            value={currentArea.title}/></label>
            <label htmlFor="contact">Descrição:
            <input type="text" onChange={(e) => setCurrentArea({...currentArea, description: e.target.value})}
            value={currentArea.description}/></label>
          </form>

          <div className="buttonWrapper">
            <button onClick={closeModal}
            className={authorized ? 'adminBtn' : 'none'}>Cancelar</button>
            <button  className={authorized ? 'adminBtn' : 'none'} onClick={changeArea}
            disabled={isProcessing}>{isProcessing ? 'Salvando..' : 'Salvar alterações'}
            </button>              
          </div>      
        </div>
      </div>

      <div className={currentArea.id !== '' && currentArea.view ? 'modal' : 'none'}>
        
        <div className="modalBoxArea">
          <div><h2 className="job" style={{textAlign: 'center'}}>{currentArea.title}</h2></div>

          <div><p>{currentArea.description}</p></div>

          <div className="buttonWrapper">
            <button onClick={closeModal}
            className='adminBtn'>Voltar</button>
            <button onClick={() => setCurrentArea({...currentArea, view: false})}
            className={authorized ? 'adminBtn' : 'none'}>Editar</button> 
          </div>      
        </div>
      </div>

      <div className={loading ? 'fullScreen' : 'none'}><div className="loader"></div></div>

      <div className={openMenu ? "mobileMenu" : 'none'}>
        <div id="returnBtn" onClick={() => setOpenMenu(false)}>
          <img style={{cursor: 'pointer'}} src='./img/arrow.svg'/>
        </div>            
        <div className="verticalNav">
          <a onClick={() => setCurrent('home')} className={current == 'home' ? 'navLinkSelected' : "navLink"}>Página Inicial</a>
          <a onClick={() => setCurrent('escritorio')} className={current == 'escritorio' ? 'navLinkSelected' : "navLink"}>Escritório</a>
          <a onClick={() => setCurrent('areas')} className={current == 'areas' ? 'navLinkSelected' : "navLink"}>Atuação</a>
          <a onClick={() => setCurrent('equipe')} className={current == 'equipe' ? 'navLinkSelected' : "navLink"}>Equipe</a>
          <a onClick={() => setCurrent('noticias')} className={current == 'noticias' ? 'navLinkSelected' : "navLink"}>Notícias</a>
          <a href="https://dantassilva.com.br/sigds.asp" target="_blank" className="navLink">Acesso →</a>
        </div>
      </div>        
    </div>
  );
}

export default App;