const employee = [{ id: "1", name: "Mohamed Sayed" }];

exports.getEmployees = async (req, res, next) => {
  res.status(200).json({ data: employee });
};

// TODO
exports.deleteEmployee = async (req, res, next) => {
  const id = req.params.id;
  const index = employee.findIndex((item) => item.id === id);
  if (index !== -1) {
    employee.splice(index, 1);
    res.status(200).json({ message: "Employee deleted successfully" });
  } else {
    res.status(404).json({ message: "Employee not found" });
  }
};

// TODO
exports.createEmployee = async (req, res, next) => {
  const { id, name } = req.body;
  if (employee.find((item) => item.id === id)) {
    return res.status(400).json({ message: "Employee already exists" });
  }
  employee.push({ id, name });
  res.status(201).json({ message: "Employee created successfully" });
};
