import React from 'react';
import Modal from '../ui/Modal';

const GabungKelasModal = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-6">
        <h2 className="text-xl font-medium mb-4">Gabung Kelas</h2>
        <input className="border p-2 w-full rounded mb-4" placeholder="Kode Kelas" />
        <button className="bg-primary text-white px-4 py-2 rounded">Gabung</button>
      </div>
    </Modal>
  );
};

export default GabungKelasModal;
