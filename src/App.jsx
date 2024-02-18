import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import Equipe from "./Equipe";
import './App.css';
import Login from "./Login";

const key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im10d2N1dmJnZHN3b2F0am51cGdiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDgwNDExOTYsImV4cCI6MjAyMzYxNzE5Nn0.dt8qknmzhpUN38Cp3WIJpJo17AxEcjIQCKOYWTciKjM";
const supabase = createClient("https://mtwcuvbgdswoatjnupgb.supabase.co", key);

function App() {

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    getCategories();
  }, []);

  async function getCategories() {
    const { data } = await supabase.from("categories").select();
    setCategories(data);
  }

  const [current, setCurrent] = useState('home');

  function Content() {
    if (current === "home") {
      return(
        <div style={{overflow: "hidden"}} className="middle">
            <div id="indexImages">
                <div className="indexImageBox" style={{backgroundImage: "url('img/sketch1.png')"}}></div>
                <div className="indexImageBox" style={{backgroundImage: "url('img/sketch2.png')"}}></div>
                <div className="indexImageBox" style={{backgroundImage: "url('img/sketch3.png')"}}></div>
            </div>
        </div>
      )
    } else if (current === "areas"){
      return(
        <div id="areasContent" className="middle">
            <h1>Áreas de atuação</h1>
            <div id="areasRow">
                <div className="areasColumn">
                    <div className="areasImageBox" style={{backgroundImage: "url('img/blank.png')"}}></div>
                    <ul>
                        <li>Seguro e Capitalização</li><hr/>
                        <li>Transporte</li><hr/>
                        <li>Responsabilidade Civil</li><hr/>
                        <li>Acidente de Trânsito</li><hr/>
                        <li>Energia</li>
                    </ul>
                </div>
                <div className="areasColumn">
                    <div id="areasImageBoxMobile" className="areasImageBox" style={{backgroundImage: "url('img/blank.png')"}}></div>
                    <ul>
                        <li>Consumidor</li><hr/>
                        <li>Bancário</li><hr/>
                        <li>Cobrança</li><hr/>
                        <li>Trabalhista</li><hr/>
                        <li>Imobiliário</li>
                    </ul>
                    <div id="areasImageBoxDesktop" className="areasImageBox" style={{backgroundImage: "url('img/blank.png')"}}></div>
                </div>
                <div className="areasColumn">
                    <div className="areasImageBox" style={{backgroundImage: "url('img/blank.png')"}}></div>
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
                <img id="floatImage" src="img/img3.jpg"/>            
                <p className="paragraph">Dantas Silva Advogados iniciou suas atividades em 1989 com os sócios Nilton Pereira da Silva e Jorge Antonio Dantas Silva, oriundos do mercado segurador. </p> <p className="paragraph">Em 1996 foi formalmente constituída a sociedade, que hoje está estabelecida à Rua da Quitanda, nº 60 – 12º andar, no Centro do Rio de Janeiro. </p> <p className="paragraph">Atuamos em todo o país por meio de nossas modernas instalações e de nossos profissionais altamente qualificados. Todos com vínculo empregatício, trabalhando com equipamentos de informática modernos e sistema próprio do escritório. </p> <p className="paragraph">Estamos prontos para atender nossos clientes do meio empresarial e pessoas físicas, seja pela modalidade presencial ou virtual. </p> <p className="paragraph">Prezamos pela ética, pela transparência e profissionalismo, com objetividade, simplicidade, rapidez e um custo equilibrado. </p> <p className="paragraph">Nossa proposta é de negociação e resolução de conflitos pela via suasória, inclusive quando em litígio judicial. </p> <p className="paragraph">Ao logo de mais de três décadas, vimos trazendo soluções diferenciadas, com projetos e propostas inovadoras, obedecendo aos interesses de nossos clientes e visando o melhor resultado para solução de seus problemas. </p> <p className="paragraph">Nosso ambiente é acolhedor e traz aos profissionais que atuam uma tranquilidade e segurança para o bom desenvolvimento de suas atividades, assim como para o recebimento de nossos clientes. </p> <p className="paragraph">Esta é nossa forma de trabalhar e nossa proposta, as quais se inserem em nossos ideais e em na razão de existir. </p>
                <p className="sign" style={{width: "100%", textAlign: "end", marginTop: "10px"}}>Jorge Antonio Dantas Silva</p>
            </div>
          </div>
        )
    } else if (current === "equipe") {
      return (
        <Equipe/>
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
        <Content/>
        <div id="foot">
            <div id="address">
                <div className="addressItem">Rua da Quitanda, 60, 12º andar</div>
                <div className="addressItem">Rio de Janeiro/RJ, Brasil - CEP 20011-030</div>
            </div>
            <p style={{textAlign: "center"}}>+55 (21) 3078-3363 - advogados@dantassilva.com.br </p>
        </div>
        <div id="copyright"><b>Copyright</b> © Dantas Silva Advogados Associados. Todos os direitos reservados.</div>
    </div>
  );
}

export default App;