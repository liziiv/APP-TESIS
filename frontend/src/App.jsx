import React from 'react';
import { Container, Navbar, Nav } from 'react-bootstrap';
import ResearchPlansList from './components/ResearchPlansList';
import './App.css'

function App() {
  return (
    <>
      <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
        <Container>
          <Navbar.Brand href="#home">Sistema de Gestión de Tesis</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link href="#plans">Planes de Investigación</Nav.Link>
              <Nav.Link href="#users">Usuarios</Nav.Link>
              <Nav.Link href="#sections">Secciones</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <ResearchPlansList />
    </>
  )
}

export default App
