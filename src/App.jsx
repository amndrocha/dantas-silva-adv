import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import Equipe from "./Equipe";
import './App.css';
import Login from "./Login";

const key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im10d2N1dmJnZHN3b2F0am51cGdiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDgwNDExOTYsImV4cCI6MjAyMzYxNzE5Nn0.dt8qknmzhpUN38Cp3WIJpJo17AxEcjIQCKOYWTciKjM";
const supabase = createClient("https://mtwcuvbgdswoatjnupgb.supabase.co", key);



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
    return image ? image.url : null;
  };



  const [current, setCurrent] = useState('home');
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const [isProcessing, setIsProcessing] = useState(false);


  const openModal = (id) => {
    console.log(images);
    console.log(id);
    console.log(getUrl(id));
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
    setCurrentImage({
      ...currentImage,
      url: image.previous,
    });
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
                  className='adminBtn'>Alterar</button>
                </div>

                <div className="indexImageBox" id="indexImageBox2"
                style={{backgroundImage: "url("+getUrl("indexImageBox2")+")"}}>
                  <button onClick={() => openModal("indexImageBox2")}
                  style={{margin: '10px'}}
                  className='adminBtn'>Alterar</button>
                </div>

                <div className="indexImageBox" id="indexImageBox3"
                style={{backgroundImage: "url("+getUrl("indexImageBox3")+")"}}>
                  <button onClick={() => openModal("indexImageBox3")}
                  style={{margin: '10px'}}
                  className='adminBtn'>Alterar</button>
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
                      className='adminBtn'>Alterar</button>
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
                      className='adminBtn'>Alterar</button>
                    </div>
                </div>
                <div className="areasColumn">
                    <div id="areasImageBox3" className="areasImageBox" style={{backgroundImage: "url("+getUrl("areasImageBox3")+")"}}>
                      <button onClick={() => openModal("areasImageBox3")}
                      style={{margin: '10px'}}
                      className='adminBtn'>Alterar</button>
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
    } else if (current === "escritorio") {
        return(
          <div id="escritorioContent" className="middle">
            <h1 style={{margin: "20px"}}>O Escritório</h1>
            <div id="textBox">
                <img id="escritorioImage" className="floatImage" src="img/img3.jpg"/>            
                <p className="paragraph">Dantas Silva Advogados iniciou suas atividades em 1989 com os sócios Nilton Pereira da Silva e Jorge Antonio Dantas Silva, oriundos do mercado segurador. </p> <p className="paragraph">Em 1996 foi formalmente constituída a sociedade, que hoje está estabelecida à Rua da Quitanda, nº 60 – 12º andar, no Centro do Rio de Janeiro. </p> <p className="paragraph">Atuamos em todo o país por meio de nossas modernas instalações e de nossos profissionais altamente qualificados. Todos com vínculo empregatício, trabalhando com equipamentos de informática modernos e sistema próprio do escritório. </p> <p className="paragraph">Estamos prontos para atender nossos clientes do meio empresarial e pessoas físicas, seja pela modalidade presencial ou virtual. </p> <p className="paragraph">Prezamos pela ética, pela transparência e profissionalismo, com objetividade, simplicidade, rapidez e um custo equilibrado. </p> <p className="paragraph">Nossa proposta é de negociação e resolução de conflitos pela via suasória, inclusive quando em litígio judicial. </p> <p className="paragraph">Ao logo de mais de três décadas, vimos trazendo soluções diferenciadas, com projetos e propostas inovadoras, obedecendo aos interesses de nossos clientes e visando o melhor resultado para solução de seus problemas. </p> <p className="paragraph">Nosso ambiente é acolhedor e traz aos profissionais que atuam uma tranquilidade e segurança para o bom desenvolvimento de suas atividades, assim como para o recebimento de nossos clientes. </p> <p className="paragraph">Esta é nossa forma de trabalhar e nossa proposta, as quais se inserem em nossos ideais e em na razão de existir. </p>
                <p className="sign" style={{width: "100%", textAlign: "end", marginTop: "10px"}}>Jorge Antonio Dantas Silva</p>
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
    } else if (current === "cadastro") {
      return (
        <div className="middle">
        </div>
      )
    } {
      return (
        <div></div>
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
      <Equipe/>
      <div id="hide" className={current === 'equipe' ? 'none' : 'middle'}></div>
      <Content/>      
      <div id="copyright"><b>Copyright</b> © Dantas Silva Advogados Associados. Todos os direitos reservados.</div>
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
      <div id="foot">
          <div id="address">
              <div className="addressItem">Rua da Quitanda, 60, 12º andar</div>
              <div className="addressItem">Rio de Janeiro/RJ, Brasil - CEP 20011-030</div>
          </div>
          <p style={{textAlign: "center"}}>+55 (21) 3078-3363 - advogados@dantassilva.com.br </p>
      </div>
      
      <div className={loading ? 'fullScreen' : 'none'}><div className="loader"></div></div>

    </div>
  );
}

export default App;