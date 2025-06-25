/**
 * Script para insertar datos de prueba en Firestore
 * Ejecutar con: npx tsx scripts/seed-data.ts
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, doc, setDoc } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyCo-0khhqb8yfqnq2byUxQ-boA_bn-nXtk",
    authDomain: "pethelp-a4e95.firebaseapp.com",
    projectId: "pethelp-a4e95",
    storageBucket: "pethelp-a4e95.firebasestorage.app",
    messagingSenderId: "775211426092",
    appId: "1:775211426092:web:30863265aa5a521c090c89",
    measurementId: "G-BXTF0Q7P3X"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Datos de prueba
const testUsers = [
  {
    id: 'user1',
    name: 'María González',
    email: 'maria.gonzalez@email.com',
    phone: '+57 300 123 4567',
    role: 'client',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'user2', 
    name: 'Carlos Rodríguez',
    email: 'carlos.rodriguez@email.com',
    phone: '+57 300 987 6543',
    role: 'client',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'user3',
    name: 'Ana Martínez',
    email: 'ana.martinez@email.com', 
    phone: '+57 300 555 1234',
    role: 'client',
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

const testPets = [
  {
    id: 'pet1',
    name: 'Luna',
    type: 'Perro',
    breed: 'Golden Retriever',
    age: 3,
    weight: 25,
    ownerId: 'user1',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'pet2',
    name: 'Mittens',
    type: 'Gato',
    breed: 'Persa',
    age: 2,
    weight: 4,
    ownerId: 'user1',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'pet3',
    name: 'Rocky',
    type: 'Perro',
    breed: 'Bulldog',
    age: 4,
    weight: 20,
    ownerId: 'user2',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'pet4',
    name: 'Whiskers',
    type: 'Gato',
    breed: 'Siamés',
    age: 1,
    weight: 3,
    ownerId: 'user3',
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

const testServices = [
  {
    id: 'service1',
    name: 'Baño y Corte Completo',
    description: 'Servicio completo de baño, corte y peinado para mascotas',
    duration: 120,
    price: 45000,
    category: 'grooming',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'service2',
    name: 'Corte de Uñas',
    description: 'Corte profesional de uñas para perros y gatos',
    duration: 30,
    price: 15000,
    category: 'grooming',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'service3',
    name: 'Cepillado Profundo',
    description: 'Cepillado profundo para eliminar pelo muerto y nudos',
    duration: 60,
    price: 25000,
    category: 'grooming',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

async function seedData() {
  try {
    console.log('🌱 Iniciando inserción de datos de prueba...');

    // Insertar usuarios
    console.log('📝 Insertando usuarios...');
    for (const user of testUsers) {
      await setDoc(doc(db, 'users', user.id), user);
      console.log(`✅ Usuario creado: ${user.name}`);
    }

    // Insertar mascotas
    console.log('🐕 Insertando mascotas...');
    for (const pet of testPets) {
      await setDoc(doc(db, 'pets', pet.id), pet);
      console.log(`✅ Mascota creada: ${pet.name} (${pet.type})`);
    }

    // Insertar servicios
    console.log('🛠️ Insertando servicios...');
    for (const service of testServices) {
      await setDoc(doc(db, 'services', service.id), service);
      console.log(`✅ Servicio creado: ${service.name}`);
    }

    console.log('🎉 ¡Datos de prueba insertados exitosamente!');
    console.log('\n📋 Resumen:');
    console.log(`- ${testUsers.length} usuarios creados`);
    console.log(`- ${testPets.length} mascotas creadas`);
    console.log(`- ${testServices.length} servicios creados`);
    console.log('\n🔗 URLs para probar:');
    console.log('- Agendar cita: http://localhost:3000/agendar/service1');
    console.log('- Dashboard grooming: http://localhost:3000/dashboard/grooming/appointments');

  } catch (error) {
    console.error('❌ Error insertando datos:', error);
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  seedData();
}

export { seedData }; 