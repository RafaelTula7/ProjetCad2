// CRUD criado utilizando jsx, porém como não consegui obter as requisições a partir do backend montado conforme foi ensinado em aula, utlizei um arquivo json e a dependencia json server para simular as requisiçoes e enviar respostas

import React, {Component} from "react";
import axios from 'axios'
import Main from '../template/Main'

const headerProps = {
    icon: 'users',
    title: 'Usuários',
    subtitle: 'Cadastro de usuários: Incluir, Listar, Alterar e Excluir'
}

const baseUrl = '/db.json' //Utilizando localmente pois quando tentei com o servidor da vercel não funcionou o metodo get
const initialState = {
    user: { name:'', email:''},
    list: []
}

//Criando o Componente para realizar as ações de cadastro
export default class UserCrud extends Component {
    //usei estado inicial atribuido ao invés de usar os hooks, não é a melhor forma de realizar tal prática
    state = {...initialState}

    componentWillMount() {
        axios(baseUrl).then(resp => {
            this.setState({ list: resp.data})
        })
    }


    //função para limpar campos
    clear () {
        this.setState({ user: initialState.user})
    }

    //função para salvar alunos no banco
    save() {
        const user = this.state.user
        const method = user.id ? 'put' : 'post'
        const url = user.id ? `${baseUrl}/${user.id}` : baseUrl
        axios[method](url, user)
            .then(resp => {
                const list = this.getUpdatedList(resp.data)
                this.setState({ user: initialState.user, list })
            }) 
    }


    // função para pegar  a lista de usuarios atualizada
    getUpdatedList(user, add = true) {
        const list = this.state.list.filter(u => u.id !== user.id)
        if(add) list.unshift(user) // adicionar a primeira posição da lista
        return list
    }

    // Função para atualizar campo do form
    updateField(event) {
        const user = {...this.state.user}
        user[event.target.name] = event.target.value;
        this.setState({ user})
    }

    //função para renderizar o formulario de cadastro
    renderForm() {
         return (
             <div className="form">
                 <div className="row">
                     <div className="col-12 col-md-6">
                        <div className="form-group">
                            <label>Nome</label>
                            <input type="text" className="form-control"
                                name="name" value={this.state.user.name}
                                onChange={e => this.updateField(e)}
                                placeholder="Digite o Nome"
                            />
                        </div>
                     </div>
                     <div className="col-12 col-md-6">
                        <div className="form-group">
                            <label>Email</label>
                            <input type="text" className="form-control"
                                name="email" value={this.state.user.email}
                                onChange={e => this.updateField(e)}
                                placeholder="Digite o email"
                            />
                        </div>
                     </div>
                 </div>

                 <hr />
                 <div className="row">
                     <div className="col-12 d-flex justify-content-end">
                         <button className="btn btn-primary" onClick={e => this.save(e)}>
                             Salvar
                         </button>

                         <button className="btn btn-secondary ml-2" onClick={e => this.clear(e)}>
                             Cancelar
                        </button>
                     </div>
                 </div>
             </div>
         )
    }

    // função para carregar usuario
    load(user) {
        this.setState({user})
    }

    //função para deletar usuario
    remove(user) {
        axios.delete(`${baseUrl}/${user.id}`).then(resp => {
            const list = this.getUpdatedList(user, false)
            this.setState({ list })
        })
    }

    
    // Função para apresentar a tabela de alunos registrados
    
    renderTable() {
        return (
            <table className="table mt-4">
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>Email</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {this.renderRows()}
                </tbody>
            </table>
        )
    }

    // função para renderizar as linhas da tabela, acessando os dados do backend

    renderRows() {
        return this.state.list.map(user => {
            return(
                <tr key={user.id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>
                        <button className="button btn-warning ml-1 mt-1" onClick={() => this.load(user)}>
                            <i className="fa fa-pencil"></i>
                        </button>
                        <button className="btn btn-danger ml-1 mt-1" onClick={() => this.remove(user)}>
                            <i className="fa fa-trash"></i>
                        </button>
                    </td>
                </tr>
            )
        })
    }

    // Função para acrescentar ao site os componentes utilizados
    render() {
        return(
            <Main {...headerProps}>
                {this.renderForm()}
                {this.renderTable()}
            </Main>
        )
    }
} 

