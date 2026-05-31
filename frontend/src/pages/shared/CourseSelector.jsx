import React from 'react';
import { useNavigate } from 'react-router-dom';
import MataKuliahList from './MataKuliahList';

const CourseSelector = ({ targetFeature, title, subtitle }) => {
  const navigate = useNavigate();

  const handleSelectCourse = (courseId) => {
    // Navigasi ke fitur spesifik untuk course yang dipilih
    // Contoh: /tugas/1
    navigate(`/${targetFeature}/${courseId}`);
  };

  return (
    <MataKuliahList 
      selectMode={true} 
      title={title} 
      subtitle={subtitle} 
      onSelect={handleSelectCourse} 
    />
  );
};

export default CourseSelector;
