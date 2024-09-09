const { Sections, Employees, Cities, Villages, Drivers } = require('../models');

// Function to convert numbers to Kurdish
function toKurdishNumbers(num) {
    const kurdishNumbers = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
    return num.toString().split('').map(digit => kurdishNumbers[parseInt(digit, 10)] || digit).join('');
}

exports.index = async (req, res) => {
    try {
        const sections = await Sections.findAll();
        const employees = await Employees.findAll({ include: Sections });
        const cities = await Cities.findAll();
        const villages = await Villages.findAll({ include: Cities });
        const drivers = await Drivers.findAll({ include: Cities });

        // Calculate the counts for the dashboard
        const managersCount = toKurdishNumbers(employees.filter(emp => emp.jobType === 'manager').length);
        const employeesCount = toKurdishNumbers(employees.filter(emp => emp.jobType === 'employee').length);

        const motorDriversCount = toKurdishNumbers(drivers.filter(driver => driver.vehicleType === 'motor').length);
        const carDriversCount = toKurdishNumbers(drivers.filter(driver => driver.vehicleType === 'car').length);
        const truckDriversCount = toKurdishNumbers(drivers.filter(driver => driver.vehicleType === 'truck').length);

        const all = {
            sections,
            employees,
            cities,
            villages,
            drivers,
            managersCount,
            employeesCount,
            motorDriversCount,
            carDriversCount,
            truckDriversCount,
        }

        res.render('index', {
            sections,
            employees,
            cities,
            villages,
            drivers,
            managersCount,
            employeesCount,
            motorDriversCount,
            carDriversCount,
            truckDriversCount,
            toKurdishNumbers
        });
        // res.json(all.sections[0].note);  
    } catch (error) {
        console.error('Error fetching dashboard data:', error);
        res.status(500).send('Internal Server Error');
    }
};
