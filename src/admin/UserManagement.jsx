import React, { useState, useEffect } from 'react';
import { 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
  Paper, Button, Switch, Typography 
} from '@mui/material';
import { db } from '../config/firebase';
import { collection, onSnapshot, updateDoc, doc } from 'firebase/firestore';

const UserManagement = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'users'), (snapshot) => {
      setUsers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return unsubscribe;
  }, []);

  const toggleActive = async (userId, currentActive) => {
    await updateDoc(doc(db, 'users', userId), { active: !currentActive });
  };

  const changeRole = async (userId, newRole) => {
    await updateDoc(doc(db, 'users', userId), { role: newRole });
  };

  return (
    <>
      <Typography variant="h5" gutterBottom>Usuarios Registrados</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Rol</TableCell>
              <TableCell>Activo</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map(user => (
              <TableRow key={user.id}>
                <TableCell>{user.nombre} {user.apellido}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Button size="small" onClick={() => changeRole(user.id, user.role === 'admin' ? 'user' : 'admin')}>
                    {user.role}
                  </Button>
                </TableCell>
                <TableCell>
                  <Switch checked={user.active} onChange={() => toggleActive(user.id, user.active)} />
                </TableCell>
                <TableCell>
                  <Button size="small" color="error" onClick={() => alert('Eliminar usuario (implementar si deseas)')}>
                    Eliminar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default UserManagement;