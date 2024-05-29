 // Tiempo que tarda en desaparecer el mensaje de error
        var time_disappear = 1500;
        MaxEquation = 4;

        let previousNumEquations =
          document.getElementById("num-equations").value;
        const form = document.getElementById("equation-form");
        const equationsContainer = document.getElementById(
          "equations-container"
        );

        const resultContainer = document.getElementById("result-container");
        form.addEventListener("submit", (event) => {
          event.preventDefault();
          const numEquations = parseInt(
            document.getElementById("num-equations").value
          );
          const equations = [];

          for (let i = 0; i < numEquations; i++) {
            const equationInputs = document.querySelectorAll(
              `#equation-${i} input.coefficient`
            );
            const operators = document.querySelectorAll(
              `#equation-${i} select`
            );
            const coefficients = [];
            let operatorIndex = 0;

            for (let j = 0; j < equationInputs.length; j++) {
              let value = parseFloat(equationInputs[j].value);
              if (j > 0) {
                const operator = operators[operatorIndex].value;
                switch (operator) {
                  case "+":
                    break;
                  case "-":
                    value = -value;
                    break;
                }
                operatorIndex++;
              }
              coefficients.push(value);
            }

            const constant = parseFloat(
              document.querySelector(`#equation-${i} input.constant`).value
            );
            equations.push({ coefficients, constant });
          }

          const result = solveSystem(equations);
          if (result != NaN) {
            displayResult(result);
          }
        });

        // Función para manejar errores
        function handleError(error) {
          const errorButton = document.createElement("button");
          if (error == 1) {
            errorButton.textContent =
              "Favor de poner un valor en todos los campos.";
          }
          if (error == 2) {
            errorButton.textContent = "No se puede resolver el sistema.";
          }

          if (error == 3) {
            errorButton.textContent = "El sistema tiene infinitas soluciones.";
          }
          if (error == 4) {
            errorButton.textContent = "El sistema no tiene solución.";
          }
          if (error == 5) {
            errorButton.textContent =
              "El número de ecuaciones debe ser mayor a 1.";
          }
          if (error == 6) {
            errorButton.textContent =
              "El número de ecuaciones debe ser menor a " + MaxEquation + ".";
          }
          errorButton.classList.add(
            "text-red-500",
            "font-bold",
            "text-center",
            "mt-4",
            "w-full",
            "bg-red-200",
            "rounded-md",
            "px-4",
            "py-2",
            "text-sm",
            "text-center",
            "rounded-md",
            "justify-center",
            "items-center",
            "border",
            "border-red-500"
          );
          if (document.body.classList.contains("dark")) {
            errorButton.classList.add(
              "dark:bg-red-700",
              "dark:border-red-700",
              "dark:text-white"
            );
          }
          if (!document.body.classList.contains("dark")) {
            errorButton.style.backgroundColor = "#fde2e2";
          }

          errorButton.addEventListener("click", () => {
            errorButton.remove();
          });
          equationsContainer.appendChild(errorButton);
          setTimeout(() => {
            errorButton.remove();
          }, time_disappear);
        }

        // Función para resolver el sistema de ecuaciones
        function solveSystem(equations) {
          if (
            equations.some((equation) => equation.coefficients.includes(NaN))
          ) {
            handleError(1);
            return;
          }
          const n = equations.length;
          const A = [];
          const b = [];

          for (const equation of equations) {
            A.push(equation.coefficients);
            b.push(equation.constant);
          }
          const x = Array(n).fill(0);

          for (let i = 0; i < n; i++) {
            let maxRow = i;
            for (let j = i + 1; j < n; j++) {
              if (Math.abs(A[j][i]) > Math.abs(A[maxRow][i])) {
                maxRow = j;
              }
            }

            [A[i], A[maxRow]] = [A[maxRow], A[i]];
            [b[i], b[maxRow]] = [b[maxRow], b[i]];

            for (let j = i + 1; j < n; j++) {
              const factor = A[j][i] / A[i][i];
              for (let k = i; k < n; k++) {
                A[j][k] -= factor * A[i][k];
              }
              b[j] -= factor * b[i];
            }
          }

          for (let i = n - 1; i >= 0; i--) {
            let sum = b[i];
            for (let j = i + 1; j < n; j++) {
              sum -= A[i][j] * x[j];
            }
            x[i] = sum / A[i][i];
          }

          return x;
        }

        // Función para mostrar el resultado
        function displayResult(result) {
          if (result.some((x) => isNaN(x))) {
            handleError(2);
            return;
          }
          if (result.some((x) => !isFinite(x))) {
            handleError(3);
            return;
          }

          if (result.some((x) => x === -Infinity)) {
            handleError(4);
            return;
          }

          resultContainer.innerHTML = "";
          const resultList = document.createElement("ul");
          resultList.classList.add("space-y-2");

          for (let i = 0; i < result.length; i++) {
            const listItem = document.createElement("li");
            listItem.classList.add(
              "bg-gray-200",
              "rounded-md",
              "px-4",
              "py-2",
              "dark:bg-slate-800",
              "dark:text-white",
              "dark:rounded-md",
              "dark:px-4",
              "dark:py-2"
            );
            listItem.textContent = `y${i + 1} = ${result[i].toFixed(2)}`;
            resultList.appendChild(listItem);
          }

          resultContainer.appendChild(resultList);

          const clearButton = document.createElement("button");
          clearButton.textContent = "Limpiar";
          clearButton.classList.add(
            "bg-red-500",
            "hover:bg-red-600",
            "text-white",
            "font-medium",
            "py-2",
            "px-4",
            "rounded-md",
            "focus:outline-none",
            "focus:ring",
            "focus:ring-red-500",
            "mt-4",
            "w-full",
            "dark:bg-red-700",
            "dark:hover:bg-red-800",
            "dark:text-white",
            "dark:focus:ring-red-700",
            "dark:ring-red-2",
            "dark:rounded-md"
          );
          clearButton.addEventListener("click", () => {
            resultContainer.innerHTML = "";
            form.reset();
          });
          resultContainer.appendChild(clearButton);
        }

        // Función para actualizar el contenedor de ecuaciones
        function updateEquationsContainer() {
          const cardWhite = document.getElementById("Card-white");
          const numEquations = parseInt(
            document.getElementById("num-equations").value
          );
          equationsContainer.innerHTML = "";

          if (numEquations <= 1) {
            handleError(5);
            return;
          }
          if (numEquations > MaxEquation) {
            handleError(6);
            return;
          }

          // Controlar estado de animación
          cardWhite.classList.toggle(
            "is-animating",
            previousNumEquations !== numEquations
          );

          if (numEquations == 2) {
            cardWhite.classList.remove("flex-wrap");
            cardWhite.classList.add("flex-col", "w-full", "max-w-md", "flex");
          }
          previousNumEquations = numEquations;

          if (numEquations >= 3 && numEquations <= MaxEquation) {
            cardWhite.classList.remove(
              "flex-col",
              "w-full",
              "max-w-md",
              "flex"
            );
            cardWhite.classList.add("flex-wrap");
          }

          for (let i = 0; i < numEquations; i++) {
            const equationDiv = document.createElement("div");
            equationDiv.classList.add(
              "flex",
              "items-center",
              "space-x-2",
              "mb-4"
            );

            equationDiv.id = `equation-${i}`;

            for (let j = 0; j < numEquations; j++) {
              const input = document.createElement("input");
              input.type = "number";
              input.classList.add(
                "border",
                "border-gray-300",
                "rounded-md",
                "px-3",
                "py-2",
                "focus:outline-none",
                "focus:ring",
                "focus:ring-purple-500",
                "coefficient",
                "dark:bg-slate-800",
                "dark:border-gray-700",
                "dark:text-white",
                "dark:focus:ring-sky-500",
                "dark:placeholder-gray-400",
                "dark:ring-sky-500"
              );
              input.placeholder = `y${j + 1}`;
              equationDiv.appendChild(input);

              if (j < numEquations - 1) {
                const operatorSelect = document.createElement("select");
                operatorSelect.classList.add(
                  "border",
                  "border-gray-300",
                  "rounded-md",
                  "px-2",
                  "py-2",
                  "focus:outline-none",
                  "focus:ring",
                  "focus:ring-purple-500",
                  "text-sm",
                  "dark:bg-slate-800",
                  "dark:border-gray-700",
                  "dark:text-white",
                  "dark:focus:ring-sky-500",
                  "dark:placeholder-gray-400",
                  "dark:ring-sky-500"
                );
                equationDiv.appendChild(operatorSelect);
                const operators = ["+", "-"];
                for (const operator of operators) {
                  const option = document.createElement("option");
                  option.value = operator;
                  option.textContent = operator;
                  operatorSelect.appendChild(option);
                }
              }
            }

            const equalSign = document.createElement("span");
            equalSign.textContent = "=";
            equalSign.classList.add(
              "text-center",
              "w-4",
              "dark:text-white",
              "dark:bg-slate-900"
            );
            equationDiv.appendChild(equalSign);

            const constantInput = document.createElement("input");
            constantInput.type = "number";
            constantInput.classList.add(
              "border",
              "border-gray-400",
              "rounded-md",
              "px-3",
              "py-2",
              "focus:outline-none",
              "focus:ring",
              "focus:ring-purple-500",
              "constant",
              "dark:bg-slate-800",
              "dark:border-gray-700",
              "dark:text-white",
              "dark:focus:ring-sky-500",
              "dark:placeholder-gray-400",
              "dark:ring-sky-800"
            );
            constantInput.placeholder = "Constante";
            equationDiv.appendChild(constantInput);

            equationsContainer.appendChild(equationDiv);
          }

          if (numEquations >= 3) {
            cardWhite.classList.add("w-50");
            equationsContainer.classList.add("flex-wrap");
          } else {
            cardWhite.classList.remove("w-24");
            equationsContainer.classList.remove("flex-wrap");
          }
        }

        // Función para cambiar el tema de la calculadora
        function changeTheme() {
          const body = document.body;
          if (body.classList.contains("dark")) {
            body.classList.remove("dark");
          } else {
            body.classList.add("dark");
          }
        }

        document
          .getElementById("num-equations")
          .addEventListener("input", updateEquationsContainer);
        updateEquationsContainer();
