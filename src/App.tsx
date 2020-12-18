import React, {
  forwardRef,
  Fragment,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import structure from "./structure.json";
import _employees from "./employees.json";
import logo from "./logo.svg";
import "./App.css";

interface TextFieldProps {
  id: string;
}

const AddNewEmployee = forwardRef(({ id }: TextFieldProps, ref) => {
  const [keyValue, setKeyValue] = useState<any>();

  useImperativeHandle(ref, () => ({
    keyValue,
  }));

  return (
    <div>
      <input
        type="text"
        id={id}
        placeholder="FullName"
        value={(keyValue && keyValue[id]) || ""}
        onChange={(e) => {
          setKeyValue({ [e.target.id]: e.target.value });
        }}
      />
    </div>
  );
});

const App = () => {
  const [employees, setEmployees] = useState<
    { id?: number; name?: string; divisionId?: string }[]
  >(_employees);

  const [newEmployee, setNewEmployee] = useState<{
    fullName?: string;
    divisionId?: string;
  }>();

  const [divisions, setDivisions] = useState(structure);

  useEffect(() => {}, []);

  function copy(o: any) {
    return Object.assign({}, o);
  }
  const handleFilterChange = (e: any) => {
    e.preventDefault();
    setDivisions(
      structure.map(copy).filter(function f(o: any) {
        return (
          o.name.includes(e.target.value) ||
          (o.subdivisions &&
            (o.subdivisions = o.subdivisions.map(copy).filter(f)).length)
        );
      })
    );
  };

  const handleKeyPress = (
    event: any,
    employee: {
      id?: number;
      name?: string;
      divisionId?: string;
    }
  ) => {
    if (event.charCode == 13) {
      event.preventDefault();
      setEmployees(
        employees?.map((e) =>
          e.id === employee.id
            ? {
                id: employee.id,
                name: event.target.textContent,
                divisionId: employee.divisionId,
              }
            : e
        )
      );
    }
  };

  const handleOnBlur = (
    event: any,
    employee: {
      id?: number;
      name?: string;
      divisionId?: string;
    }
  ) => {
    event.preventDefault();
    setEmployees(
      employees?.map((e) =>
        e.id === employee.id
          ? {
              id: employee.id,
              name: event.target.textContent,
              divisionId: employee.divisionId,
            }
          : e
      )
    );
  };

  const toggleOpen = (division: any) => {
    const toggle = (divisions: any) => {
      let result = divisions.map((d: any) => {
        return d.id === division.id
          ? {
              ...d,
              open: !d.open,
            }
          : {
              ...d,
              ...(d.subdivisions && { subdivisions: toggle(d.subdivisions) }),
            };
      });
      return result;
    };
    setDivisions(toggle(divisions));
  };

  const handleButtonClick = (divisionId: string) => {
    if (ref?.current.keyValue) {
      setEmployees([
        ...employees,
        {
          id: employees.length,
          name: ref?.current.keyValue[divisionId],
          divisionId: divisionId,
        },
      ]);
    }
  };

  const ref: any = useRef();

  const Divisions = ({ items: divisions }: any) => {
    if (!divisions || !divisions.length) {
      return null;
    }
    return divisions?.map((division: any) => (
      <Fragment key={division.id}>
        <ul id="myUL">
          <li>
            <span
              className={division?.open ? "caret caret-down" : "caret"}
              onClick={() => toggleOpen(division)}
            >
              {division.name}
            </span>
            <ul className={division?.open ? "nested active" : "nested"}>
              <li>
                <table>
                  <tbody>
                    <tr>
                      <th>id</th>
                      <th>name</th>
                      <th>divisionId</th>
                    </tr>
                    {employees
                      ?.filter(
                        (employee) => employee.divisionId === division.id
                      )
                      ?.map((employee) => {
                        return (
                          <tr key={employee.id}>
                            <td>{employee.id}</td>
                            <td
                              contentEditable
                              suppressContentEditableWarning={true}
                              onBlur={(e) => handleOnBlur(e, employee)}
                              onKeyPress={(e) => handleKeyPress(e, employee)}
                            >
                              {employee.name}
                            </td>
                            <td>{employee.divisionId}</td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
                <div>
                  <input
                    type="button"
                    value="Add Employee"
                    onClick={() => handleButtonClick(division.id)}
                  />
                  <AddNewEmployee id={division.id} ref={ref} />
                </div>
              </li>
              <li>
                <Divisions items={division.subdivisions} />
              </li>
            </ul>
          </li>
        </ul>
      </Fragment>
    ));
  };

  return (
    <Fragment>
      <div>
        <input
          onChange={handleFilterChange}
          placeholder="search for division"
        />
      </div>
      <Divisions items={divisions} />
    </Fragment>
  );
};

export default App;
