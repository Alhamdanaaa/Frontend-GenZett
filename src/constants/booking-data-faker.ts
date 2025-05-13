// src/constants/faker-data.ts
import { faker } from '@faker-js/faker'

export function generateBookingData() {
  const user = {
    userId: faker.number.int({ min: 1, max: 1000 }),
    name: faker.person.fullName(),
    email: faker.internet.email(),
    phone: faker.phone.number({ style: 'international' }),
  }

  const location = {
    locationId: faker.number.int(),
    locationName: faker.location.city(),
    description: faker.lorem.sentence(),
    locationPath: faker.image.urlPicsumPhotos(),
  }

  const sport = {
    sportId: 1,
    sportName: faker.helpers.arrayElement(['Futsal', 'Badminton', 'Basket', 'Tenis']),
  }

  const field = {
    fieldId: faker.number.int(),
    name: `Lapangan ${faker.word.adjective()} ${sport.sportName}`,
    description: faker.lorem.sentence(),
    sport,
    location,
  }

  const time = {
    timeId: faker.number.int(),
    time: faker.date.anytime().toTimeString().substring(0, 5),
    price: faker.number.int({ min: 50000, max: 150000 }),
    status: 'available',
  }

  const reservation = {
    reservationId: faker.number.int(),
    user,
    status: 'confirmed',
    paymentStatus: 'paid',
    total: time.price,
    created_at: faker.date.past(),
  }

  const reservationDetail = {
    detailId: faker.number.int(),
    reservationId: reservation.reservationId,
    field,
    time,
    date: faker.date.future().toISOString().split('T')[0],
  }

  const payment = {
    paymentId: faker.number.int(),
    reservationId: reservation.reservationId,
    invoiceDate: faker.date.recent(),
    totalPaid: time.price,
    created_at: faker.date.recent(),
  }

  return {
    reservation,
    reservationDetail,
    payment,
  }
}
