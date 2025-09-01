

---

# Problem Creation API

This project is about creating programming problems and testing solutions automatically using an online judge service.

## Key Terms

### **Problem**

A programming challenge that has:

* **Title** – the name of the problem (e.g., *Sum of Two Numbers*).
* **Description** – what the problem is asking the user to do.
* **Difficulty** – how hard the problem is (*Easy, Medium, Hard*).
* **Tags** – categories or topics (e.g., *math, arrays, strings*).

### **Test Cases**

Inputs and outputs used to check if a solution works.

* **Visible Test Cases**: Examples the user can see when solving the problem.
* **Hidden Test Cases**: Secret tests used to make sure the solution works for all scenarios.

### **Start Code**

The initial code provided to the user when they start solving the problem. Usually incomplete, so the user must finish it.

### **Reference Solution**

A correct solution created by the problem creator. This is tested against all test cases to make sure the problem itself is valid.

### **Problem Creator**

The person who makes and submits the problem.

### **Language IDs**

Every programming language has a special ID used by the online judge service. For example:

* **C++ → 54**
* **Java → 62**
* **JavaScript → 63**

### **Batch Submission**

Sending multiple test cases at once to the judge system to check if the solution passes them all.

### **Judge0 API**

An external service that compiles and runs code. This project uses it to:

* Run the reference solutions.
* Check if they pass all the test cases.

---

## How It Works (Step by Step)

1. The problem creator writes the **title, description, test cases, start code, and reference solution**.
2. The reference solution is sent to **Judge0 API**.
3. Judge0 runs the solution against the **visible test cases**.
4. If the solution passes, the problem is created successfully.
5. Later, users can attempt to solve the problem using the given **start code**.

---


## Tokens in Batch Submission

When solutions are submitted to Judge0, results are **not returned immediately**.

Instead:

1. **Submit Batch** – The problem’s reference solution is sent with all visible test cases.
2. **Judge0 Returns Tokens** – Each test case gets a unique **token**. Think of this as a **ticket number**.
3. **Fetch Results** – You send the tokens back to Judge0 to check the outcome.
4. **Receive Results** – Judge0 responds with:

   * Execution status (e.g., Accepted, Wrong Answer, Compilation Error).
   * Program output.
   * Time and memory usage.

---

## Why Tokens?

* **Asynchronous Processing** – Judge0 may need time to run your code, so it issues tokens first.
* **Multiple Submissions** – Each test case in a batch has its own token, making it easy to track results separately.
* **Scalability** – Large numbers of test cases can be managed efficiently.

---

## Workflow Example

1. Problem creator submits a reference solution with **3 visible test cases**.
2. Judge0 replies with **3 tokens** (one for each test case).
3. The system waits briefly, then sends these tokens back to Judge0.
4. Judge0 replies with results:

   * Test 1 → Passed
   * Test 2 → Failed (Wrong Answer)
   * Test 3 → Passed
5. If all tests pass, the problem is marked as valid.

---

