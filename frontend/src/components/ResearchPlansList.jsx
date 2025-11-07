import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Alert, Spinner } from 'react-bootstrap';
import { getResearchPlans } from '../services/api';

const ResearchPlansList = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const response = await getResearchPlans();
      if (response.data.success) {
        setPlans(response.data.data);
      } else {
        setError('Error al cargar los planes de investigación');
      }
    } catch (err) {
      setError('Error de conexión con el servidor');
      console.error('Error fetching plans:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container className="d-flex justify-content-center mt-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Cargando...</span>
        </Spinner>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-5">
        <Alert variant="danger">
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="mt-5">
      <Row className="mb-4">
        <Col>
          <h1 className="text-center">Planes de Investigación</h1>
        </Col>
      </Row>

      <Row>
        {plans.length === 0 ? (
          <Col>
            <Alert variant="info" className="text-center">
              No hay planes de investigación registrados.
            </Alert>
          </Col>
        ) : (
          plans.map((plan) => (
            <Col key={plan.id} md={6} lg={4} className="mb-4">
              <Card className="h-100">
                <Card.Body>
                  <Card.Title>{plan.title}</Card.Title>
                  <Card.Text>
                    <strong>Descripción:</strong> {plan.description}
                  </Card.Text>
                  <Card.Text>
                    <strong>Estado:</strong> {plan.status}
                  </Card.Text>
                  <Card.Text>
                    <strong>Progreso:</strong> {plan.progress}%
                  </Card.Text>
                  <Button variant="primary" className="me-2">
                    Ver Detalles
                  </Button>
                  <Button variant="outline-secondary">
                    Editar
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))
        )}
      </Row>
    </Container>
  );
};

export default ResearchPlansList;