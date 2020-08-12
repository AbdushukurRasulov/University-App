import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { logout } from '../../redux/user/user-actions';
import { clearProfile } from '../../redux/profile/profile-actions';

import './header.styles.scss';

const Header = ({ auth: { isAuthenticated, loading }, logout, clearProfile }) => {

    const authLinks = (
        <Fragment>
            <Link className='nav-link link' to='/dashboard'>
                <i className="fas fa-table fa-lg"></i>
                <div>Dashboard</div>
            </Link>
            <Link className='nav-link link' to='/mensagens'>
                <i className="far fa-comment fa-lg"></i>
                <div>Mensagens</div>
            </Link>
            <Link className='nav-link link' to='/postagens'>
                <i className="fas fa-chalkboard-teacher fa-lg"></i>
                <div>Postagens</div>
            </Link>
            <a className='nav-link link' onClick={() => {logout(); clearProfile();}} >
                <i className='fas fa-sign-out-alt fa-lg text-danger' />{' '}
                <div className='hide-sm'>Sair</div>
            </a>
        </Fragment> 
    );

    
    const guestLinks = (
            <Fragment>
                <Link className='nav-link link ' to='/registrar'>
                    <i className="fas fa-user-plus fa-lg"></i>
                    <div>Registrar</div>
                </Link>
                <Link className='nav-link link ' to='/logar'>
                    <i className="fas fa-sign-in-alt fa-lg"></i>
                    <div>Entrar</div>
                </Link>
            </Fragment>
    )

    return (
        <nav className='navbar navbar-expand-lg bg nv'>
            <button id="nav-button" className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"><i className="fas fa-bars"></i></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarSupportedContent">
                <ul className="navbar-nav margin-center">
                    <Link className='nav-link link' to='/'>
                        <i className="fas fa-home fa-lg"></i>
                        <div>Início</div>
                    </Link>
                    <Link className='nav-link link' to='/estudantes'>
                        <i className="fas fa-users fa-lg"></i>
                        <div>Comunidade</div>
                    </Link>
                    {!loading && (
                        <Fragment>{isAuthenticated ? authLinks : guestLinks}</Fragment>
                    )}
                </ul>
            </div>
        </nav>
    )
};

const mapStateToProps = state => ({
    auth: state.user
  });

export default connect(mapStateToProps, { logout, clearProfile })(Header);