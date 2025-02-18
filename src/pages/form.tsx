import {SetStateAction, useEffect, useState} from "react";
import Head from "next/head";
import Image from "next/image";
import {Inter} from "next/font/google";
import styles from "@/styles/Home.module.css";
import {Formik, Form, Field, ErrorMessage, FieldArray} from "formik";
import * as Yup from "yup";
import {useRouter} from "next/router";
import Cookies from "universal-cookie";
import stateJson from '../utiles/state.json';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL

export default function Home() {
  const router = useRouter();
  const [data, setData] = useState<any>({});
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const totalSteps = 5;
  const {query} = router;
  const cookies = new Cookies();
  const authToken = cookies.get("authToken");

  const handleNext = async (
    validateForm: () => any,
    setTouched: (arg0: any) => void
  ) => {
    // setCurrentStep((prevStep) => Math.min(prevStep + 1, totalSteps));//1234
    const errors = await validateForm();
    if (Object.keys(errors).length === 0) {
      setCurrentStep((prevStep) => Math.min(prevStep + 1, totalSteps));
    } else {
      const touchedFields = Object.keys(errors).reduce(
        (acc: {[key: string]: boolean}, key) => {
          acc[key] = true;
          return acc;
        },
        {}
      );
      setTouched(touchedFields);
    }
  };


  const prevStep = () => {
    setCurrentStep((prevStep) => Math.max(prevStep - 1, 1));
  };

  const ordinalOrderArray = [
    "first",
    "second",
    "third",
    "fourth",
    "fifth",
    "sixth",
    "seventh",
    "eighth",
    "ninth",
    "tenth"
  ];

  const Relationship = ["Son", "Daughter", "Father", "Mother", "Niece", "Nephew", "Step Mother", "Step Father", "Friend", "Aunt", "Uncle", "Grandmother", "Grandfather", "Other"]

  const stepSchemas: {
    [key: number]: Yup.ObjectSchema<any>;
  } = {
    1: Yup.object({
      firstName: Yup.string().required("First Name is required"),
      middleName: Yup.string().optional(),
      lastName: Yup.string().required("Last Name is required"),
      maidenNameRedio: Yup.string()
        .oneOf(["yes", "no"], "Select Yes or No")
        .required("Maiden Status is required"),
      otherNameStatus: Yup.string()
        .oneOf(["yes", "no"], "Select Yes or No")
        .required("Name Status is required"),
      maidenName: Yup.string().when("maidenNameRedio", {
        is: (value: string) => value === "yes",
        then: (schema) => schema.required("Maiden Name is required"),
        otherwise: (schema) => schema,
      }),
      nameCount: Yup.string().when("otherNameStatus", {
        is: (value: string) => value == "yes",
        then: (schema) => schema.required("how many names?"),
        otherwise: (schema) => schema,
      }),
      nameList: Yup.array().of(
        Yup.object({
          otherFirstName: Yup.string()
            .required("First Name is required")
            .min(2, "First Name must be at least 2 characters long"),
          otherMiddleName: Yup.string()
            .required("Middle Name is required")
            .min(2, "Middle Name must be at least 2 characters long"),
          otherLastName: Yup.string()
            .required("Last Name is required")
            .min(2, "Last Name must be at least 2 characters long"),
        }).when("otherNameStatus", {
          is: (value: string) => value === "yes",
          then: (schema) => schema.required("Enter name details"),
          otherwise: (schema) => schema,
        })
      ),
      address1: Yup.string().required("Address1 is required"),
      address2: Yup.string().optional(),
      city: Yup.string().required("City is required"),
      state: Yup.string().required("State is required"),
      zipCode: Yup.number()
        .required("Zip Code is required")
        .positive()
        .integer(),
      county: Yup.string().required("County is required"),
      gender: Yup.string().required("Gender is required"),
      phoneNumber: Yup.string()
        .required("Phone Number is required")
        .min(10, "Phone Number must be exactly 10 digits")
        .max(10, "Phone Number must be exactly 10 digits"),
      emailAddress: Yup.string()
        .email("Invalid email address")
        .required("Email Address is required"),
      bornCountryStatus: Yup.string()
        .oneOf(["yes", "no"], "Select Yes or No")
        .required("born in USA or other nations"),
      bornCountry: Yup.string().when("bornCountryStatus", {
        is: (value: string) => value === "no",
        then: (schema) => schema.required("Enter born Country"),
        otherwise: (schema) => schema,
      }),
      bornMilitaryBase: Yup.string().when("bornCountryStatus", {
        is: (value: string) => value === "no",
        then: (schema) => schema.oneOf(["yes", "no",], "Select Yes or No for military base status").required("Please select your military base status"),
        otherwise: (schema) => schema,
      }),

      federalEmployee: Yup.string()
        .oneOf(["yes", "no"], "Select Yes or No")
        .required("Federal Employee Status is required"),

      greenCard: Yup.string()
        .oneOf(["yes", "no"], "Select Yes or No")
        .required("Green Card Status is required"),


      bornDate: Yup.date().required("Born Date is required"),
      bornCity: Yup.string().when("bornCountryStatus", {
        is: (value: string) => value === "yes",
        then: (schema) => schema.required("Born City is required"),
        otherwise: (schema) => schema,
      }),
      bornState: Yup.string().when("bornCountryStatus", {
        is: (value: string) => value == "yes",
        then: (schema) => schema.required("Born State is required"),
        otherwise: (schema) => schema,
      }),

      bornCounty: Yup.string().when("bornCountryStatus", {
        is: (value: string) => value == "yes",
        then: (schema) => schema.required("Born County is required"),
        otherwise: (schema) => schema,
      }),
      marriageCount: Yup.string().when("currentlyMarried", {
        is: (value: string) => value === "1",
        then: (schema) => schema.required("Number of marriages is required"),
        otherwise: (schema) => schema,
      }),
      currentlyMarried: Yup.string()
        .oneOf(["1", "0"], "Select Yes or No")
        .required("Current Marital Status is required"),
      weddingDate: Yup.string().when("currentlyMarried", {
        is: (value: string) => value === "1",
        then: (schema) => schema.required("Wedding Date is required"),
        otherwise: (schema) => schema,
      }),
      weddingCity: Yup.string().when("RecordedMarried", {
        is: (value: string) => value === "1",
        then: (schema) => schema.required("Wedding City is required"),
        otherwise: (schema) => schema,
      }),
      weddingState: Yup.string().when("RecordedMarried", {
        is: (value: string) => value === "1",
        then: (schema) => schema.required("Wedding State is required"),
        otherwise: (schema) => schema,
      }),

      RecordedMarried: Yup.string().when("currentlyMarried", {
        is: (value: string) => value == "1",
        then: (schema) => schema.required("Marriage is Recorded is required"),
        otherwise: (schema) => schema,
      }),

      weddingcountry: Yup.string().when("RecordedMarried", {
        is: (value: string) => value == "0",
        then: (schema) => schema.required("wedding country is required"),
        otherwise: (schema) => schema,
      }),

      veteran: Yup.string().required(
        "Veteran status is required"
      ),
    }),
    2: Yup.object({
      fathersFullName: Yup.string().required("Father’s Full Name is required"),
      mothersFullName: Yup.string().required("Mother’s Full Name is required"),
      mothersMaidenName: Yup.string().required(
        "Mother’s Maiden Name is required"
      ),
      parentsWeddingDate: Yup.date().required(
        "Parents’ Wedding Date is required"
      ),
      parentsWeddingCity: Yup.string().required(
        "Parents’ Wedding City is required"
      ),
      parentsWeddingState: Yup.string().required(
        "Parents’ Wedding State is required"
      ),
      parentsMarriedAtBirth: Yup.string()
        .oneOf(["Yes", "No"], "Select Yes or No")
        .required("Were your parents married at the time of your birth?"),
    }),
    3: Yup.object({
      witness1FirstName: Yup.string().required(
        "Witness1 First Name is required"
      ),
      witness1MiddleName: Yup.string().optional(),
      witness1LastName: Yup.string().required("Witness1 Last Name is required"),
      witness1FullAddress: Yup.string().required(
        "Witness1 Full Address is required"
      ),
      witness1County: Yup.string().required("Witness1 County is required"),
      witness1Relationship: Yup.string().required(
        "Witness1 Relationship to Candidate is required"
      ),
      witness1RelationshipType: Yup.string().when("witness1Relationship", {
        is: (value: string) => value === "Other",
        then: (schema) => schema.required("Witness1 Relationship to Candidate is required"),
        otherwise: (schema) => schema,
      }),
      witness1PhoneNumber: Yup.string()
        .required("Phone Number is required")
        .min(10, "Phone Number must be exactly 10 digits")
        .max(10, "Phone Number must be exactly 10 digits"),
      witness1EmailAddress: Yup.string()
        .email("Invalid email address")
        .required("Witness1 Email Address is required"),
      witness1Gender: Yup.string().required("Witness1 Gender is required"),
    }),
    4: Yup.object({
      witness2FirstName: Yup.string().required(
        "Witness2 First Name is required"
      ),
      witness2MiddleName: Yup.string().optional(),
      witness2LastName: Yup.string().required("Witness2 Last Name is required"),
      witness2FullAddress: Yup.string().required(
        "Witness2 Full Address is required"
      ),
      witness2County: Yup.string().required("Witness2 County is required"),
      witness2Relationship: Yup.string().required(
        "Witness2 Relationship to Candidate is required"
      ),
      witness2RelationshipType: Yup.string().when("witness2Relationship", {
        is: (value: string) => value === "Other",
        then: (schema) => schema.required("Witness2 Relationship to Candidate is required"),
        otherwise: (schema) => schema,
      }),
      witness2PhoneNumber: Yup.string()
        .required("Phone Number is required")
        .min(10, "Phone Number must be exactly 10 digits")
        .max(10, "Phone Number must be exactly 10 digits"),
      witness2EmailAddress: Yup.string()
        .email("Invalid email address")
        .required("Witness2 Email Address is required"),
      witness2Gender: Yup.string().required("Witness2 Gender is required"),
    }),
    5: Yup.object({
      progeny: Yup.string().required("Progeny status is required"),
      progenyCount: Yup.string().when("progeny", {
        is: (value: string) => value === "yes",
        then: (schema) => schema.required("Total progeny count is required"),
        otherwise: (schema) => schema,
      }),
      progenyCount21: Yup.string().when("childrenUnder21", {
        is: (value: string) => value == "Yes",
        then: (schema) => schema.required("total Progeny count over 21?"),
        otherwise: (schema) => schema,
      }),
      marriedWhenChildrenBorn: Yup.string().when("progeny", {
        is: (value: string) => value == "yes",
        then: (schema) => schema.required("Were You Married when Progeny was born?"),
        otherwise: (schema) => schema,
      }),
      childrenUnder21: Yup.string().when("progeny", {
        is: (value: string) => value == "yes",
        then: (schema) => schema.required("Any Progeny under 21? is required"),
        otherwise: (schema) => schema,
      }),
      childList: Yup.array().of(
        Yup.object({
          childrenFullName: Yup.string()
            .required('Progeny’s Full Name is required')
            .min(2, 'Name must be at least 2 characters long'),
          childrenBornDayTime: Yup.date()
            .required('Progeny’s Born Day and Time is required')
            .nullable(),
          childrenStateOfBirth: Yup.string()
            .required('Progeny’s State of Birth is required'),
          childrenGender: Yup.string()
            .required('Progeny’s Gender'),
          childrenCountyOfBirth: Yup.string()
            .required('Progeny’s County of Birth is required'),
          fatherFullName: Yup.string()
            .required('Father’s Full Name is required')
            .min(2, 'Name must be at least 2 characters long'),
          fatherBornDate: Yup.date()
            .required('Father’s Born Date is required')
            .nullable(),
          fatherForeignCountry: Yup.string().oneOf(["yes", "no"], "Select Yes or No")
            .required('father’s Born status is required'),
          motherForeignCountry: Yup.string().oneOf(["yes", "no"], "Select Yes or No")
            .required('mother’s Born status is required'),
          fatherBornState: Yup.string().when("fatherForeignCountry", {
            is: (value: string) => value == "no",
            then: (schema) => schema.required("Father’s Born State is required"),
            otherwise: (schema) => schema,
          }),
          fatherBornCounty: Yup.string()
            .when("fatherForeignCountry", {
              is: (value: string) => value == "no",
              then: (schema) => schema.required('Father’s Born County is required')
                .min(2, 'County must be at least 2 characters long'),
              otherwise: (schema) => schema,
            }),
          fatherBornCountry: Yup.string().when("fatherForeignCountry", {
            is: (value: string) => value == "yes",
            then: (schema) => schema.required('Father’s Born Country is required'),
            otherwise: (schema) => schema,
          }),
          motherBornCountry: Yup.string().when("motherForeignCountry", {
            is: (value: string) => value == "yes",
            then: (schema) => schema.required('mother’s Born Country is required'),
            otherwise: (schema) => schema,
          })
          ,
          mailingAddress: Yup.string().required('Mailing address is required'),
          motherFullName: Yup.string()
            .required('Mother’s Full Name is required')
            .min(2, 'Name must be at least 2 characters long'),
          motherBornDate: Yup.date()
            .required('Mother’s Born Date is required')
            .nullable(),
          motherBornState: Yup.string().when("motherForeignCountry", {
            is: (value: string) => value == "no",
            then: (schema) => schema.required('Mother’s Born State is required'),
            otherwise: (schema) => schema,
          }),
          motherBornCounty: Yup.string().when("motherForeignCountry", {
            is: (value: string) => value == "no",
            then: (schema) => schema.required('Mother’s Born County is required')
              .min(2, 'County must be at least 2 characters long'),
            otherwise: (schema) => schema,
          }),
          childrenOrder: Yup.string()
            .required('Order of Child is required')
            .oneOf(ordinalOrderArray, 'Please select a valid order (first, second, etc.)'),
        })
      ).when('childrenUnder21', (childrenUnder21: any, schema) => {
        return schema.notRequired();
      }),

      postStreetAddress: Yup.string().required("Street Address is required"),
      postcity: Yup.string().required("City is required"),
      postzipCode: Yup.string()
        .required("Zip Code is required")
        .matches(/^\d{5,6}$/, "Zip Code must be exactly 6 digits"),
      sameFatherMother: Yup.object({}).nullable(),
      recordDocuments: Yup.string()
      .oneOf(["Notary", "SRS"], "Select Notary or SRS")
      .required("please Select record documents type")
    }),
    
  };

  const formatDate = (isoDateString: string) => {
    if (!isoDateString) return "";

    const date = new Date(isoDateString);
    if (isNaN(date.getTime())) {
      return "";
    }

    return date.toISOString().split('T')[0];
  };
  const getFormattedDateTime = (isoDateString: string) => {
    if (!isoDateString) return "";

    const date = new Date(isoDateString);
    if (isNaN(date.getTime())) {
      return "";
    }

    return date.toISOString().slice(0, 16);
  };

  function convertDatesToMySQLFormat(values: any) {
    const dateFields = [
      'bornDate',
      'weddingDate',
      'parentsWeddingDate',
    ];

    const formattedValues = {...values};

    dateFields.forEach(field => {
      if (formattedValues[field]) {
        const date = new Date(formattedValues[field]);
        if (!isNaN(date.getTime())) {
          // Valid date, convert to MySQL format
          formattedValues[field] = date.toISOString().split('T')[0];
        } else {
          // Invalid date, handle it accordingly
          console.error(`Invalid date for field: ${field}`, formattedValues[field]);
          formattedValues[field] = null; // Or set to an empty string or default value
        }
      } else {
        formattedValues[field] = null;
      }
    });

    return formattedValues;
  }


  const handleSubmit = async (values: any) => {
    setLoading(true)
    const formattedValues = convertDatesToMySQLFormat(values);
    formattedValues.weddingDate = values.weddingDate == '' ? null : values.weddingDate

    console.log(formattedValues)
    const url = query.id
      ? baseUrl + `/api/v1/form/update/${query.id}`
      : baseUrl + '/api/v1/form/create';
    const method = query.id ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formattedValues),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      if (response.status == 404) {
        router.push('/');
      }
      const result = await response.json();
      setLoading(false)

      window.alert(!query.id ? "PDF sent to your email" : "Updated PDF sent to user email")
      // Optionally, redirect to another page after successful update or creation
      if (authToken) {
        router.push("/dashboard");
      } else {
        setData({})
        setCurrentStep(1)
      }
    } catch (error: any) {
      setLoading(false)
      console.error('Error submitting data:', error);
      setError(error?.message);
    } finally {
      setLoading(false)
    }
  };

  useEffect(() => {
    if (query.id && !authToken) {
      router.replace("/");
    }

    if (query.id) {
      const fetchData = async () => {
        try {
          const response = await fetch(
            baseUrl + `/api/v1/form/list/${query.id}`,
            {
              headers: {
                Authorization: `Bearer ${authToken}`,
                "Content-Type": "application/json",
              },
              credentials: "include",
            }
          );

          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          if (response.status == 404) {
            router.push('/');
          }
          const result = await response.json();
          setData(result.data);
          setLoading(false);
        } catch (error: any) {
          console.error("Error fetching data:", error);
          setError(error?.message);
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [query.id, authToken]);

  function convertJson(data: any): object {
    if (data === null || data === undefined) {
      return [];
    }
    try {
      const parsedData = JSON.parse(data);
      return parsedData;
    } catch (error) {
      return [];
    }
  }

  return (
    <>
      <div className="container">
        <div className="title">
          {currentStep === 1 && "Personal Information"}
          {currentStep === 2 && "Parent Information"}
          {currentStep === 3 && "Witness-1 Information"}
          {currentStep === 4 && "Witness-2 Information"}
          {currentStep === 5 && "Progeny Details"}
        </div>
        <div className="content">
          <Formik
            initialValues={{
              firstName: data?.firstName ? data.firstName : "",
              middleName: data?.middleName ? data.middleName : "",
              lastName: data?.lastName ? data.lastName : "",
              maidenNameRedio: data?.maidenNameRedio ? data.maidenNameRedio : "no",
              otherNameStatus: data?.otherNameStatus ? data.otherNameStatus : "",
              nameList: data?.nameList ? convertJson(data?.nameList) : [],
              nameCount: data?.nameCount ? data.nameCount : "",
              maidenName: data?.maidenName ? data.maidenName : "",
              address1: data?.address1 ? data.address1 : "",
              address2: data?.address2 ? data.address2 : "",
              city: data?.city ? data.city : "",
              state: data?.state ? data.state : "",
              zipCode: data?.zipCode ? data.zipCode : "",
              county: data?.county ? data.county : "",
              gender: data?.gender ? data.gender : "",
              phoneNumber: data?.phoneNumber ? data.phoneNumber : "",
              emailAddress: data?.emailAddress ? data.emailAddress : "",
              bornCountryStatus: data?.bornCountryStatus ? data?.bornCountryStatus : "",
              bornMilitaryBase: data?.bornMilitaryBase ? data?.bornMilitaryBase : "",
              federalEmployee: data?.federalEmployee ? data?.federalEmployee : "",
              greenCard: data?.greenCard ? data?.greenCard : "",
              bornCountry: data?.bornCountry ? data?.bornCountry : "",
              bornDate: formatDate(data?.bornDate),
              bornCity: data?.bornCity ? data.bornCity : "",
              bornState: data?.bornState ? data.bornState : "",
              bornCounty: data?.bornCounty ? data.bornCounty : "",
              marriageCount: data?.marriageCount ? data.marriageCount : "",
              currentlyMarried: data?.currentlyMarried
                ? data.currentlyMarried
                : "",
              weddingDate: formatDate(data?.weddingDate),
              weddingCity: data?.weddingCity ? data.weddingCity : "",
              weddingState: data?.weddingState ? data.weddingState : "",
              RecordedMarried: data?.RecordedMarried ? data.RecordedMarried : "",
              weddingcountry: data?.weddingcountry ? data.weddingcountry : "",
              veteran: data?.veteran ? data.veteran : "",
              fathersFullName: data?.fathersFullName
                ? data.fathersFullName
                : "",
              mothersFullName: data?.mothersFullName
                ? data.mothersFullName
                : "",
              mothersMaidenName: data?.mothersMaidenName
                ? data.mothersMaidenName
                : "",
              parentsWeddingDate: formatDate(data?.parentsWeddingDate),
              parentsWeddingCity: data?.parentsWeddingCity
                ? data.parentsWeddingCity
                : "",
              parentsWeddingState: data?.parentsWeddingState
                ? data.parentsWeddingState
                : "",
              parentsMarriedAtBirth: data?.parentsMarriedAtBirth
                ? data.parentsMarriedAtBirth
                : "",
              witness1FirstName: data?.witness1FirstName
                ? data.witness1FirstName
                : "",
              witness1MiddleName: data?.witness1MiddleName
                ? data.witness1MiddleName
                : "",
              witness1LastName: data?.witness1LastName
                ? data.witness1LastName
                : "",
              witness1FullAddress: data?.witness1FullAddress
                ? data.witness1FullAddress
                : "",
              witness1County: data?.witness1County ? data.witness1County : "",
              witness1Relationship: data?.witness1Relationship
                ? data.witness1Relationship
                : "",
              witness1PhoneNumber: data?.witness1PhoneNumber
                ? data.witness1PhoneNumber
                : "",
              witness1EmailAddress: data?.witness1EmailAddress
                ? data.witness1EmailAddress
                : "",
              witness1Gender: data?.witness1Gender ? data.witness1Gender : "",
              witness2FirstName: data?.witness2FirstName
                ? data.witness2FirstName
                : "",
              witness2MiddleName: data?.witness2MiddleName
                ? data.witness2MiddleName
                : "",
              witness2LastName: data?.witness2LastName
                ? data.witness2LastName
                : "",
              witness2FullAddress: data?.witness2FullAddress
                ? data.witness2FullAddress
                : "",
              witness2County: data?.witness2County ? data.witness2County : "",
              witness2Relationship: data?.witness2Relationship
                ? data.witness2Relationship
                : "",
              witness2PhoneNumber: data?.witness2PhoneNumber
                ? data.witness2PhoneNumber
                : "",
              witness2EmailAddress: data?.witness2EmailAddress
                ? data.witness2EmailAddress
                : "",
              witness2RelationshipType: data?.witness2RelationshipType ? data?.witness2RelationshipType : "",
              witness1RelationshipType: data?.witness1RelationshipType ? data?.witness1RelationshipType : "",
              witness2Gender: data?.witness2Gender ? data.witness2Gender : "",
              marriedWhenChildrenBorn: data?.marriedWhenChildrenBorn
                ? data.marriedWhenChildrenBorn
                : "",
              progeny: data?.progeny
                ? data.progeny
                : "",
              childrenUnder21: data?.childrenUnder21
                ? data.childrenUnder21
                : "",
              childList: data?.childList ? convertJson(data?.childList) : [{}],
              progenyCount21: data?.progenyCount21 ? data.progenyCount21 : "",
              progenyCount: data?.progenyCount ? data.progenyCount : "",

              postStreetAddress: data?.postStreetAddress
                ? data?.postStreetAddress
                : "",
              postcity: data?.postCity ? data?.postCity : "",
              postzipCode: data?.postZipCode ? data?.postZipCode : "",
              recordDocuments: data?.recordDocuments ? data?.recordDocuments : "",
              
            }}
            validationSchema={stepSchemas[currentStep]}
            onSubmit={handleSubmit}
            enableReinitialize
          >
            {({values, handleChange, validateForm, setTouched, errors, setFieldValue}: any) => {

              console.log(errors)
              return (
                <Form>
                  <div className="user-details">
                    {currentStep === 1 && (
                      <>
                        <div className="input-box">
                          <span className="details">First Name</span>
                          <Field
                            type="text"
                            name="firstName"
                            placeholder="Enter your first name"
                          />
                          <ErrorMessage
                            name="firstName"
                            component="div"
                            className="error-message"
                          />
                        </div>

                        <div className="input-box">
                          <span className="details">Middle Name</span>
                          <Field
                            type="text"
                            name="middleName"
                            placeholder="Enter your middle name"
                          />
                          <ErrorMessage
                            name="middleName"
                            component="div"
                            className="error-message"
                          />
                        </div>
                        <div className="input-box">
                          <span className="details">Last Name</span>
                          <Field
                            type="text"
                            name="lastName"
                            placeholder="Enter your last name"
                          />
                          <ErrorMessage
                            name="lastName"
                            component="div"
                            className="error-message"
                          />
                        </div>
                        <div className="input-box">
                          {/*{values?.maidenNameRedio == "yes" && <div>
                            <span className="details">Maiden Name</span>
                            <Field
                              type="text"
                              name="maidenName"
                              placeholder="Enter your maiden name"
                            />
                            <ErrorMessage
                              name="maidenName"
                              component="div"
                              className="error-message"
                            />
                          </div>}*/}
                        </div>
                        <div className="input-box">
                          <span className="details">
                            Have you gone by any other name?
                          </span>
                          <div className="category">
                            <label>
                              <Field
                                type="radio"
                                name="otherNameStatus"
                                value="yes"
                                onChange={(
                                  e: React.ChangeEvent<HTMLInputElement>
                                ) => {
                                  setFieldValue("otherNameStatus", e.target.value)
                                  setFieldValue('nameList', [{
                                    otherFirstName: "", otherMiddleName: "", otherLastName: ""
                                  }]);
                                  setFieldValue('nameCount', 1);
                                }}
                              />
                              <span className="dot one"></span>
                              <span className="marital-status">Yes</span>
                            </label>
                            &nbsp;
                            <label>
                              <Field
                                type="radio"
                                name="otherNameStatus"
                                value="no"
                                onChange={(
                                  e: React.ChangeEvent<HTMLInputElement>
                                ) => {
                                  setFieldValue("otherNameStatus", e.target.value)
                                  setFieldValue('nameList', []);
                                  setFieldValue('nameCount', '');
                                }}
                              />
                              <span className="dot two"></span>
                              <span className="marital-status">No</span>
                            </label>
                          </div>
                          <ErrorMessage
                            name="otherNameStatus"
                            component="div"
                            className="error-message"
                          />
                        </div>


                        {values.otherNameStatus == 'yes' && <div className="input-box">
                          <div>
                            <span className="details"> How many other names besides your birth name have you gone by? </span>
                            <Field
                              as="select"
                              name="nameCount"
                              className="form-select"
                              onChange={(e: any) => {
                                setFieldValue('nameCount', e.target.value);
                                setFieldValue('nameList', Array(+e.target.value).fill({
                                  otherFirstName: "", otherMiddleName: "", otherLastName: ""
                                }));
                              }}
                            >
                              {Array(10).fill(0).map((item: any, index: number) => (
                                <option key={index} value={index + 1}>
                                  {index + 1}
                                </option>
                              ))}

                            </Field>
                            <ErrorMessage
                              name="nameCount"
                              component="div"
                              className="error-message"
                            />
                          </div>
                        </div>}
                        <FieldArray name="nameList">
                          {({insert, remove}) =>
                            values?.nameList?.length > 0 ? (
                              <>
                                {values.nameList.map((child: any, index: number) => (
                                  <div key={index} className="childListArray">
                                    <span className="details">
                                      <b>{index + 1}.  Names</b>
                                    </span>

                                    <div className="input-box"></div>
                                    <div className="input-box">
                                      <span className="details">First Name</span>
                                      <Field
                                        type="text"
                                        name={`nameList[${index}].otherFirstName`}
                                        placeholder="Enter your first name"
                                      />
                                      <ErrorMessage
                                        name={`nameList[${index}].otherFirstName`}
                                        component="div"
                                        className="error-message"
                                      />
                                    </div>

                                    <div className="input-box">
                                      <span className="details">Middle Name</span>
                                      <Field
                                        type="text"
                                        name={`nameList[${index}].otherMiddleName`}
                                        placeholder="Enter your middle name"
                                      />
                                      <ErrorMessage
                                        name={`nameList[${index}].otherMiddleName`}
                                        component="div"
                                        className="error-message"
                                      />
                                    </div>

                                    <div className="input-box">
                                      <span className="details">Last Name</span>
                                      <Field
                                        type="text"
                                        name={`nameList[${index}].otherLastName`}
                                        placeholder="Enter your last name"
                                      />
                                      <ErrorMessage
                                        name={`nameList[${index}].otherLastName`}
                                        component="div"
                                        className="error-message"
                                      />
                                    </div>

                                  </div>
                                ))}
                              </>
                            ) : (
                              <div className="input-box"></div>
                            )
                          }
                        </FieldArray>



                        <div className="input-box">
                          <div >
                            <span className="details">
                              Do you have a Maiden Name
                            </span>
                            <div className="category">
                              <label>
                                <Field
                                  type="radio"
                                  name="maidenNameRedio"
                                  value="yes"
                                  onChange={(
                                    e: React.ChangeEvent<HTMLInputElement>
                                  ) => {
                                    setFieldValue("maidenNameRedio", e.target.value)
                                  }}
                                />
                                <span className="dot one"></span>
                                <span className="marital-status">Yes</span>
                              </label>
                              &nbsp;
                              <label>
                                <Field
                                  type="radio"
                                  name="maidenNameRedio"
                                  value="no"
                                  onChange={(
                                    e: React.ChangeEvent<HTMLInputElement>
                                  ) => {
                                    setFieldValue("maidenNameRedio", e.target.value)
                                    setFieldValue("maidenName", "")
                                  }}
                                />
                                <span className="dot two"></span>
                                <span className="marital-status">No</span>
                              </label>
                            </div>
                            <ErrorMessage
                              name="maidenNameRedio"
                              component="div"
                              className="error-message"
                            />
                          </div>
                          {values?.maidenNameRedio == "yes" && <div>
                            <span className="details">Maiden Name</span>
                            <Field
                              type="text"
                              name="maidenName"
                              placeholder="Enter your maiden name"
                            />
                            <ErrorMessage
                              name="maidenName"
                              component="div"
                              className="error-message"
                            />
                          </div>}
                        </div>

                        <div className="input-box">
                          <span className="details">Address1</span>
                          <Field
                            as="textarea"
                            name="address1"
                            rows={5}
                            placeholder="Enter your address1"
                          />
                          <ErrorMessage
                            name="address1"
                            component="div"
                            className="error-message"
                          />
                        </div>

                        <div className="input-box">
                          <span className="details">Address2 (Optional)</span>
                          <Field
                            as="textarea"
                            name="address2"
                            rows={5}
                            placeholder="Enter your address2"
                          />
                          <ErrorMessage
                            name="address2"
                            component="div"
                            className="error-message"
                          />
                        </div>

                        <div className="input-box">
                          <span className="details">City</span>
                          <Field
                            type="text"
                            name="city"
                            placeholder="Enter your city"
                          />
                          <ErrorMessage
                            name="city"
                            component="div"
                            className="error-message"
                          />
                        </div>

                        <div className="input-box">
                          <span className="details">State</span>
                          <Field
                            as="select"
                            name="state"
                            className="form-select"
                          >
                            <option value="" label="Select a state" />
                            {Object.entries(stateJson).map(([abbreviation, name]) => (
                              <option key={name} value={name}>
                                {name}
                              </option>
                            ))}

                          </Field>
                          <ErrorMessage
                            name="state"
                            component="div"
                            className="error-message"
                          />
                        </div>

                        <div className="input-box">
                          <span className="details">Zip Code</span>
                          <Field
                            type="number"
                            name="zipCode"
                            placeholder="Enter your zip code"
                          />
                          <ErrorMessage
                            name="zipCode"
                            component="div"
                            className="error-message"
                          />
                        </div>

                        <div className="input-box">
                          <span className="details">County</span>
                          <Field
                            type="text"
                            name="county"
                            placeholder="Enter your county"
                          />
                          <ErrorMessage
                            name="county"
                            component="div"
                            className="error-message"
                          />
                        </div>

                        <div className="input-box">
                          <div className="details">
                            <span className="gender-title">Gender</span>
                            <div className="category">
                              <label htmlFor="dot-1">
                                <Field
                                  type="radio"
                                  id="dot-1"
                                  name="gender"
                                  value="Male"
                                />
                                <span className="dot one"></span>
                                <span className="gender">Male</span>
                              </label>
                              &nbsp;
                              <label htmlFor="dot-2">
                                <Field
                                  type="radio"
                                  id="dot-2"
                                  name="gender"
                                  value="Female"
                                />
                                <span className="dot two"></span>
                                <span className="gender">Female</span>
                              </label>
                            </div>
                            <ErrorMessage
                              name="gender"
                              component="div"
                              className="error-message"
                            />
                          </div>
                        </div>

                        <div className="input-box">
                          <span className="details">Phone Number</span>
                          <Field
                            type="tel"
                            name="phoneNumber"
                            // pattern="\d{3}-\d{3}-\d{4}"
                            placeholder="Enter your phone number (9999999999)"
                          />
                          <ErrorMessage
                            name="phoneNumber"
                            component="div"
                            className="error-message"
                          />
                        </div>

                        <div className="input-box">
                          <span className="details">Email Address</span>
                          <Field
                            type="email"
                            name="emailAddress"
                            placeholder="Enter your email address"
                          />
                          <ErrorMessage
                            name="emailAddress"
                            component="div"
                            className="error-message"
                          />
                        </div>

                        <div className="input-box">
                          <div className="details">
                            <span className="bornCountryStatus-status">Were you born in USA</span>
                            <div className="category">
                              <label htmlFor="bornCountryStatus-dot-1">
                                <Field
                                  type="radio"
                                  id="bornCountryStatus-dot-1"
                                  name="bornCountryStatus"
                                  value="yes"
                                  onChange={(
                                    e: React.ChangeEvent<HTMLInputElement>
                                  ) => {
                                    setFieldValue('bornMilitaryBase', "no");
                                    setFieldValue('bornCountryStatus', e.target.value);
                                  }}
                                />
                                <span className="dot one"></span>
                                <span className="bornCountryStatus">Yes</span>
                              </label>
                              &nbsp;
                              <label htmlFor="bornCountryStatus-dot-2">
                                <Field
                                  type="radio"
                                  id="bornCountryStatus-dot-2"
                                  name="bornCountryStatus"
                                  value="no"
                                  onChange={(
                                    e: React.ChangeEvent<HTMLInputElement>
                                  ) => {
                                    setFieldValue('bornCountryStatus', e.target.value);
                                  }}
                                />
                                <span className="dot two"></span>
                                <span className="bornCountryStatus">No</span>
                              </label>
                            </div>
                            <ErrorMessage
                              name="bornCountryStatus"
                              component="div"
                              className="error-message"
                            />
                          </div>

                          {values?.bornCountryStatus == "no" && <div className="input-box">
                            <div className="details">
                              <span className="bornMilitaryBase-title">Born in a military base in foreign nation</span>
                              <div className="category">
                                <label htmlFor="bornMilitaryBase-dot-1">
                                  <Field
                                    type="radio"
                                    id="bornMilitaryBase-dot-1"
                                    name="bornMilitaryBase"
                                    value="yes"
                                  />
                                  <span className="dot one"></span>
                                  <span className="bornMilitaryBase">Yes</span>
                                </label>
                                &nbsp;
                                <label htmlFor="bornMilitaryBase-dot-2">
                                  <Field
                                    type="radio"
                                    id="bornMilitaryBase-dot-2"
                                    name="bornMilitaryBase"
                                    value="no"
                                  />
                                  <span className="dot two"></span>
                                  <span className="bornMilitaryBase">No</span>
                                </label>
                              </div>
                              <ErrorMessage
                                name="bornMilitaryBase"
                                component="div"
                                className="error-message"
                              />
                            </div>
                          </div>}
                        </div>


                        <div className="input-box">
                          <div className="details">
                            <span className="federalEmployee-status">Are you a Federal Employee?</span>
                            <div className="category">
                              <label htmlFor="federalEmployee-dot-1">
                                <Field
                                  type="radio"
                                  id="federalEmployee-dot-1"
                                  name="federalEmployee"
                                  value="yes"
                                />
                                <span className="dot one"></span>
                                <span className="federalEmployee">Yes</span>
                              </label>
                              &nbsp;
                              <label htmlFor="federalEmployee-dot-2">
                                <Field
                                  type="radio"
                                  id="federalEmployee-dot-2"
                                  name="federalEmployee"
                                  value="no"
                                />
                                <span className="dot two"></span>
                                <span className="federalEmployee">No</span>
                              </label>
                            </div>
                            <ErrorMessage
                              name="federalEmployee"
                              component="div"
                              className="error-message"
                            />
                          </div>

                          <div className="details">
                            <span className="greenCard-status">Do you have a Green Card?</span>
                            <div className="category">
                              <label htmlFor="greenCard-dot-1">
                                <Field
                                  type="radio"
                                  id="greenCard-dot-1"
                                  name="greenCard"
                                  value="yes"
                                />
                                <span className="dot one"></span>
                                <span className="greenCard">Yes</span>
                              </label>
                              &nbsp;
                              <label htmlFor="greenCard-dot-2">
                                <Field
                                  type="radio"
                                  id="greenCard-dot-2"
                                  name="greenCard"
                                  value="no"
                                />
                                <span className="dot two"></span>
                                <span className="greenCard">No</span>
                              </label>
                            </div>
                            <ErrorMessage
                              name="greenCard"
                              component="div"
                              className="error-message"
                            />
                          </div>
                        </div>

                        <div className="input-box">
                          <span className="details">Born Date</span>
                          <Field
                            type="date"
                            name="bornDate"
                            placeholder="Enter your birth date"
                          />
                          <ErrorMessage
                            name="bornDate"
                            component="div"
                            className="error-message"
                          />
                        </div>

                        {values?.bornCountryStatus == "yes" && <div className="input-box">
                          <span className="details">Born City</span>
                          <Field
                            type="text"
                            name="bornCity"
                            placeholder="Enter your birth city"
                          />
                          <ErrorMessage
                            name="bornCity"
                            component="div"
                            className="error-message"
                          />
                        </div>}

                        {values?.bornCountryStatus == "yes" && <div className="input-box">
                          <span className="details">Born State</span>
                          <Field
                            as="select"
                            name="bornState"
                            className="form-select"
                          >
                            <option value="" label="Select a state" />
                            {Object.entries(stateJson).map(([abbreviation, name]) => (
                              <option key={name} value={name}>
                                {name}
                              </option>
                            ))}

                          </Field>
                          <ErrorMessage
                            name="bornState"
                            component="div"
                            className="error-message"
                          />
                        </div>}

                        {values?.bornCountryStatus == "yes" && <div className="input-box">
                          <span className="details">Born County</span>
                          <Field
                            type="text"
                            name="bornCounty"
                            placeholder="Enter your birth county"
                          />
                          <ErrorMessage
                            name="bornCounty"
                            component="div"
                            className="error-message"
                          />
                        </div>}

                        {values?.bornCountryStatus == "no" && <div className="input-box">
                          <span className="details">Born Country</span>
                          <Field
                            type="text"
                            name="bornCountry"
                            placeholder="Enter your birth Country"
                          />
                          <ErrorMessage
                            name="bornCountry"
                            component="div"
                            className="error-message"
                          />
                        </div>}

                        <div className="input-box">
                          <div className="details">
                            <span className="details-title">
                              Are You Currently Married?
                            </span>
                            <div className="category">
                              <label>
                                <Field
                                  type="radio"
                                  name="currentlyMarried"
                                  value="1"
                                  onChange={(
                                    e: React.ChangeEvent<HTMLInputElement>
                                  ) => {
                                    setFieldValue('currentlyMarried', e.target.value);
                                  }}
                                />
                                <span className="dot one"></span>
                                <span className="marital-status">Yes</span>
                              </label>
                              &nbsp;
                              <label>
                                <Field
                                  type="radio"
                                  name="currentlyMarried"
                                  value="0"
                                  onChange={(
                                    e: React.ChangeEvent<HTMLInputElement>
                                  ) => {
                                    setFieldValue('currentlyMarried', e.target.value);
                                  }}
                                />
                                <span className="dot two"></span>
                                <span className="marital-status">No</span>
                              </label>
                            </div>
                            <ErrorMessage
                              name="currentlyMarried"
                              component="div"
                              className="error-message"
                            />
                          </div>
                        </div>

                        <div className="input-box">
                        </div>

                        {values?.currentlyMarried == "1" && (
                          <>

                            <div className="input-box">
                              <span className="details">
                                How many times have you been married?
                              </span>
                              <Field
                                as="select"
                                name="marriageCount"
                                className="form-select"
                              >
                                <option value="" label="Select married Count" />
                                {Array(10).fill(0).map((_, index) => (
                                  <option key={index} value={index + 1}>
                                    {index + 1}
                                  </option>
                                ))}
                              </Field>
                              <ErrorMessage
                                name="marriageCount"
                                component="div"
                                className="error-message"
                              />
                            </div>
                            <div className="input-box">
                              <div className="details">
                                <span className="details-title">
                                  Marriage is Recorded in USA?
                                </span>
                                <div className="category">
                                  <label>
                                    <Field
                                      type="radio"
                                      name="RecordedMarried"
                                      value="1"
                                    />
                                    <span className="dot one"></span>
                                    <span className="RecordedMarried-status">Yes</span>
                                  </label>
                                  &nbsp;
                                  <label>
                                    <Field
                                      type="radio"
                                      name="RecordedMarried"
                                      value="0"
                                    />
                                    <span className="dot two"></span>
                                    <span className="RecordedMarried-status">No</span>
                                  </label>
                                </div>
                                <ErrorMessage
                                  name="RecordedMarried"
                                  component="div"
                                  className="error-message"
                                />
                              </div>
                            </div>

                            {values?.RecordedMarried == "0" && <div className="input-box">
                              <span className="details">wedding country</span>
                              <Field
                                type="text"
                                name="weddingcountry"
                                placeholder="Enter your wedding country"
                              />
                              <ErrorMessage
                                name="weddingcountry"
                                component="div"
                                className="error-message"
                              />
                            </div>}

                            <div className="input-box">
                              <span className="details">Wedding Date</span>
                              <Field
                                type="date"
                                name="weddingDate"
                                placeholder="Enter your wedding date"
                              />
                              <ErrorMessage
                                name="weddingDate"
                                component="div"
                                className="error-message"
                              />
                            </div>

                            {values?.RecordedMarried == "1" &&
                              <>
                                <div className="input-box">
                                  <span className="details">Wedding City</span>
                                  <Field
                                    type="text"
                                    name="weddingCity"
                                    placeholder="Enter your wedding city"
                                  />
                                  <ErrorMessage
                                    name="weddingCity"
                                    component="div"
                                    className="error-message"
                                  />
                                </div>

                                <div className="input-box">
                                  <span className="details">Wedding State</span>
                                  <Field
                                    as="select"
                                    name="weddingState"
                                    className="form-select"
                                  >
                                    <option value="" label="Select a state" />
                                    {Object.entries(stateJson).map(([abbreviation, name]) => (
                                      <option key={name} value={name}>
                                        {name}
                                      </option>
                                    ))}

                                  </Field>
                                  <ErrorMessage
                                    name="weddingState"
                                    component="div"
                                    className="error-message"
                                  />
                                </div>
                              </>}
                          </>
                        )}
                        <div className="input-box"></div>
                        <div className="input-box">
                          <span className="details">
                            Veteran?
                          </span>
                          <div className="category">
                            <label>
                              <Field
                                type="radio"
                                name="veteran"
                                value="yes"

                              />
                              <span className="dot one"></span>
                              <span className="veteran-status">Yes</span>
                            </label>
                            &nbsp;
                            <label>
                              <Field
                                type="radio"
                                name="veteran"
                                value="no"

                              />
                              <span className="dot two"></span>
                              <span className="veteran-status">No</span>
                            </label>
                          </div>
                          <ErrorMessage
                            name="veteran"
                            component="div"
                            className="error-message"
                          />
                        </div>
                      </>
                    )}
                    {currentStep === 2 && (
                      <>
                        <div className="input-box">
                          <span className="details">Father’s Full Name</span>
                          <Field
                            type="text"
                            name="fathersFullName"
                            placeholder="Enter your father's full name"
                          />
                          <ErrorMessage
                            name="fathersFullName"
                            component="div"
                            className="error-message"
                          />
                        </div>
                        <div className="input-box">
                          <span className="details">Mother’s Full Name</span>
                          <Field
                            type="text"
                            name="mothersFullName"
                            placeholder="Enter your mother's full name"
                          />
                          <ErrorMessage
                            name="mothersFullName"
                            component="div"
                            className="error-message"
                          />
                        </div>
                        <div className="input-box">
                          <span className="details">Mother’s Maiden Name</span>
                          <Field
                            type="text"
                            name="mothersMaidenName"
                            placeholder="Enter your mother's maiden name"
                          />
                          <ErrorMessage
                            name="mothersMaidenName"
                            component="div"
                            className="error-message"
                          />
                        </div>
                        <div className="input-box">
                          <span className="details">Parents’ Wedding Date</span>
                          <Field
                            type="date"
                            name="parentsWeddingDate"
                            placeholder="Enter your parents' wedding date"
                          />
                          <ErrorMessage
                            name="parentsWeddingDate"
                            component="div"
                            className="error-message"
                          />
                        </div>
                        <div className="input-box">
                          <span className="details">Parents’ Wedding City</span>
                          <Field
                            type="text"
                            name="parentsWeddingCity"
                            placeholder="Enter your parents' wedding city"
                          />
                          <ErrorMessage
                            name="parentsWeddingCity"
                            component="div"
                            className="error-message"
                          />
                        </div>
                        <div className="input-box">
                          <span className="details">Parents’ Wedding State</span>
                          <Field
                            as="select"
                            name="parentsWeddingState"
                            className="form-select"
                          >
                            <option value="" label="Select a state" />
                            {Object.entries(stateJson).map(([abbreviation, name]) => (
                              <option key={name} value={name}>
                                {name}
                              </option>
                            ))}

                          </Field>
                          <ErrorMessage
                            name="parentsWeddingState"
                            component="div"
                            className="error-message"
                          />
                        </div>
                        <div className="details">
                          <span className="details-title">
                            Were your parents married at the time of your birth?
                          </span>
                          <div className="category">
                            <label>
                              <Field
                                type="radio"
                                name="parentsMarriedAtBirth"
                                value="Yes"
                              />
                              <span className="dot one"></span>
                              <span className="marital-status">Yes</span>
                            </label>
                            &nbsp;
                            <label>
                              <Field
                                type="radio"
                                name="parentsMarriedAtBirth"
                                value="No"
                              />
                              <span className="dot two"></span>
                              <span className="marital-status">No</span>
                            </label>
                          </div>
                          <ErrorMessage
                            name="parentsMarriedAtBirth"
                            component="div"
                            className="error-message"
                          />
                        </div>
                      </>
                    )}
                    {currentStep === 3 && (
                      <>
                        <div className="input-box">
                          <span className="details">Witness1 First Name</span>
                          <Field
                            type="text"
                            name="witness1FirstName"
                            placeholder="Enter witness1 first name"
                          />
                          <ErrorMessage
                            name="witness1FirstName"
                            component="div"
                            className="error-message"
                          />
                        </div>
                        <div className="input-box">
                          <span className="details">Witness1 Middle Name</span>
                          <Field
                            type="text"
                            name="witness1MiddleName"
                            placeholder="Enter witness1 middle name"
                          />
                          <ErrorMessage
                            name="witness1MiddleName"
                            component="div"
                            className="error-message"
                          />
                        </div>
                        <div className="input-box">
                          <span className="details">Witness1 Last Name</span>
                          <Field
                            type="text"
                            name="witness1LastName"
                            placeholder="Enter witness1 last name"
                          />
                          <ErrorMessage
                            name="witness1LastName"
                            component="div"
                            className="error-message"
                          />
                        </div>
                        <div className="input-box">
                          <span className="details">Witness1 Full Address</span>
                          <Field
                            as="textarea"
                            rows={5}
                            name="witness1FullAddress"
                            placeholder="Enter witness1 full address"
                          />
                          <ErrorMessage
                            name="witness1FullAddress"
                            component="div"
                            className="error-message"
                          />
                        </div>
                        <div className="input-box">
                          <span className="details">Witness 1 County</span>
                          <Field
                            type="text"
                            name="witness1County"
                            placeholder="Enter witness1 county"
                          />
                          <ErrorMessage
                            name="witness1County"
                            component="div"
                            className="error-message"
                          />
                        </div>
                        <div className="input-box">
                          <div>
                            <span className="details">
                              Witness1 Relationship to Candidate
                            </span>
                            <Field
                              as="select"
                              name="witness1Relationship"
                              className="form-select"
                              onChange={(
                                e: React.ChangeEvent<HTMLInputElement>
                              ) => {
                                setFieldValue("witness1Relationship", e.target.value)
                              }}
                            >
                              <option value="" label="Select Relationship" />
                              {Relationship.map((item: string, index: number) => (
                                <option key={index} value={item}>
                                  {item}
                                </option>
                              ))}
                            </Field>
                            <ErrorMessage
                              name="witness1Relationship"
                              component="div"
                              className="error-message"
                            />

                          </div>

                          {values?.witness1Relationship == "Other" && <div>
                            <span className="details">
                              Relationship
                            </span>
                            <Field
                              type="text"
                              name="witness1RelationshipType"
                              placeholder="Enter witness1 relationship to candidate"
                            />
                            <ErrorMessage
                              name="witness1RelationshipType"
                              component="div"
                              className="error-message"
                            />
                          </div>}
                        </div>

                        <div className="input-box">
                          <span className="details">Witness1 Phone Number</span>
                          <Field
                            type="tel"
                            name="witness1PhoneNumber"
                            placeholder="Enter witness1 phone number (9999999999)"
                          />
                          <ErrorMessage
                            name="witness1PhoneNumber"
                            component="div"
                            className="error-message"
                          />
                        </div>
                        <div className="input-box">
                          <span className="details">Witness1 Email Address</span>
                          <Field
                            type="email"
                            name="witness1EmailAddress"
                            placeholder="Enter witness1 email address"
                          />
                          <ErrorMessage
                            name="witness1EmailAddress"
                            component="div"
                            className="error-message"
                          />
                        </div>
                        <div className="details">
                          <span className="gender-title">Witness1 Gender</span>
                          <div className="category">
                            <label>
                              <Field
                                type="radio"
                                name="witness1Gender"
                                value="Male"
                              />
                              <span className="dot one"></span>
                              <span className="gender">Male</span>
                            </label>
                            &nbsp;
                            <label>
                              <Field
                                type="radio"
                                name="witness1Gender"
                                value="Female"
                              />
                              <span className="dot two"></span>
                              <span className="gender">Female</span>
                            </label>
                          </div>
                          <ErrorMessage
                            name="witness1Gender"
                            component="div"
                            className="error-message"
                          />
                        </div>
                      </>
                    )}
                    {currentStep === 4 && (
                      <>
                        <div className="input-box">
                          <span className="details">Witness2 First Name</span>
                          <Field
                            type="text"
                            name="witness2FirstName"
                            placeholder="Enter witness2 first name"
                          />
                          <ErrorMessage
                            name="witness2FirstName"
                            component="div"
                            className="error-message"
                          />
                        </div>
                        <div className="input-box">
                          <span className="details">Witness2 Middle Name</span>
                          <Field
                            type="text"
                            name="witness2MiddleName"
                            placeholder="Enter witness2 middle name"
                          />
                          <ErrorMessage
                            name="witness2MiddleName"
                            component="div"
                            className="error-message"
                          />
                        </div>
                        <div className="input-box">
                          <span className="details">Witness2 Last Name</span>
                          <Field
                            type="text"
                            name="witness2LastName"
                            placeholder="Enter witness2 last name"
                          />
                          <ErrorMessage
                            name="witness2LastName"
                            component="div"
                            className="error-message"
                          />
                        </div>
                        <div className="input-box">
                          <span className="details">Witness2 Full Address</span>
                          <Field
                            as="textarea"
                            rows={5}
                            name="witness2FullAddress"
                            placeholder="Enter witness2 full address"
                          />
                          <ErrorMessage
                            name="witness2FullAddress"
                            component="div"
                            className="error-message"
                          />
                        </div>
                        <div className="input-box">
                          <span className="details">Witness 2 County</span>
                          <Field
                            type="text"
                            name="witness2County"
                            placeholder="Enter witness2 county"
                          />
                          <ErrorMessage
                            name="witness2County"
                            component="div"
                            className="error-message"
                          />
                        </div>
                        <div className="input-box">
                          <div>
                            <span className="details">
                              Witness2 Relationship to Candidate
                            </span>
                            <Field
                              as="select"
                              name="witness2Relationship"
                              className="form-select"
                              onChange={(
                                e: React.ChangeEvent<HTMLInputElement>
                              ) => {
                                setFieldValue("witness2Relationship", e.target.value)
                              }}
                            >
                              <option value="" label="Select Relationship" />
                              {Relationship.map((item: string, index: number) => (
                                <option key={index} value={item}>
                                  {item}
                                </option>
                              ))}
                            </Field>
                            <ErrorMessage
                              name="witness2Relationship"
                              component="div"
                              className="error-message"
                            />

                          </div>

                          {values?.witness2Relationship == "Other" && <div>
                            <span className="details">
                              Relationship
                            </span>
                            <Field
                              type="text"
                              name="witness2RelationshipType"
                              placeholder="Enter witness2 relationship to candidate"
                            />
                            <ErrorMessage
                              name="witness2RelationshipType"
                              component="div"
                              className="error-message"
                            />
                          </div>}
                        </div>
                        <div className="input-box">
                          <span className="details">Witness2 Phone Number</span>
                          <Field
                            type="tel"
                            name="witness2PhoneNumber"
                            placeholder="Enter witness2 phone number (9999999999)"
                          />
                          <ErrorMessage
                            name="witness2PhoneNumber"
                            component="div"
                            className="error-message"
                          />
                        </div>
                        <div className="input-box">
                          <span className="details">Witness2 Email Address</span>
                          <Field
                            type="email"
                            name="witness2EmailAddress"
                            placeholder="Enter witness2 email address"
                          />
                          <ErrorMessage
                            name="witness2EmailAddress"
                            component="div"
                            className="error-message"
                          />
                        </div>
                        <div className="details">
                          <span className="gender-title">Witness2 Gender</span>
                          <div className="category">
                            <label>
                              <Field
                                type="radio"
                                name="witness2Gender"
                                value="Male"
                              />
                              <span className="dot one"></span>
                              <span className="gender">Male</span>
                            </label>
                            &nbsp;
                            <label>
                              <Field
                                type="radio"
                                name="witness2Gender"
                                value="Female"
                              />
                              <span className="dot two"></span>
                              <span className="gender">Female</span>
                            </label>
                          </div>
                          <ErrorMessage
                            name="witness2Gender"
                            component="div"
                            className="error-message"
                          />
                        </div>
                      </>
                    )}
                    {currentStep === 5 && (
                      <>
                        <div >
                          <span className="details-title">
                            Do you have any Progeny?
                          </span>
                          <div className="category">
                            <label>
                              <Field
                                type="radio"
                                name="progeny"
                                value="yes"
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                  setFieldValue('progeny', e.target.value);
                                  if (e.target.value === "no") {
                                    setFieldValue('childrenUnder21', "No");
                                  }
                                }}
                              />
                              <span className="dot one"></span>
                              <span className="progeny-status">Yes</span>
                            </label>
                            &nbsp;
                            <label>
                              <Field
                                type="radio"
                                name="progeny"
                                value="no"
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                  setFieldValue('progeny', e.target.value);
                                  if (e.target.value === "no") {
                                    setFieldValue('childrenUnder21', "No");
                                    setFieldValue('childList', []);
                                    setFieldValue('progenyCount', 0);
                                  }
                                }}
                              />
                              <span className="dot two"></span>
                              <span className="progeny-status">No</span>
                            </label>
                          </div>
                          <ErrorMessage
                            name="progeny"
                            component="div"
                            className="error-message"
                          />
                        </div>
                        <div className="input-box"></div>
                        {values.progeny == "yes"
                          &&
                          <>
                            <div className="input-box">
                              <span className="details">
                                Were You Married when Progeny was born?
                              </span>
                              <div className="category">
                                <label>
                                  <Field
                                    type="radio"
                                    name="marriedWhenChildrenBorn"
                                    value="Yes"
                                  />
                                  <span className="dot one"></span>
                                  <span className="marital-status">Yes</span>
                                </label>
                                &nbsp;
                                <label>
                                  <Field
                                    type="radio"
                                    name="marriedWhenChildrenBorn"
                                    value="No"
                                  />
                                  <span className="dot two"></span>
                                  <span className="marital-status">No</span>
                                </label>
                              </div>
                              <ErrorMessage
                                name="marriedWhenChildrenBorn"
                                component="div"
                                className="error-message"
                              />
                            </div>


                            <div className="input-box">
                              <div>
                                <span className="details-title">
                                  Any Progeny under 21?
                                </span>
                                <div className="category">
                                  <label>
                                    <Field
                                      type="radio"
                                      name="childrenUnder21"
                                      value="Yes"
                                      onChange={(
                                        e: React.ChangeEvent<HTMLInputElement>
                                      ) => {
                                        setFieldValue("childrenUnder21", e.target.value)
                                      }}
                                    />
                                    <span className="dot one"></span>
                                    <span className="marital-status">Yes</span>
                                  </label>
                                  &nbsp;
                                  <label>
                                    <Field
                                      type="radio"
                                      name="childrenUnder21"
                                      value="No"
                                      onChange={(e: any) => {
                                        setFieldValue('childrenUnder21', e.target.value);
                                      }}
                                    />
                                    <span className="dot two"></span>
                                    <span className="marital-status">No</span>
                                  </label>
                                </div>
                                <ErrorMessage
                                  name="childrenUnder21"
                                  component="div"
                                  className="error-message"
                                />
                              </div>
                            </div>
                            <div className="input-box">
                              {values?.childrenUnder21 == "Yes" && <div>
                                <span className="details">How many progeny over 21?</span>
                                <Field
                                  as="select"
                                  name="progenyCount21"
                                  className="form-select"
                                  onChange={(e: any) => {
                                    setFieldValue('progenyCount21', e.target.value);
                                  }}
                                >
                                  <option value="" label="Select progeny Count" />
                                  {Array(10).fill(0).map((_, index) => (
                                    <option key={index} value={index + 1}>
                                      {index + 1}
                                    </option>
                                  ))}
                                </Field>
                                <ErrorMessage
                                  name="progenyCount21"
                                  component="div"
                                  className="error-message"
                                />
                              </div>}


                            </div>
                            <div className="input-box">
                              <div>
                                <span className="details">How many total progeny?</span>
                                <Field
                                  as="select"
                                  name="progenyCount"
                                  className="form-select"
                                  onChange={(e: any) => {
                                    setFieldValue('progenyCount', e.target.value);
                                    setFieldValue('childList', Array(+e.target.value).fill({
                                      childrenFullName: '',
                                      childrenBornDayTime: '',
                                      childrenStateOfBirth: '',
                                      childrenCountyOfBirth: '',
                                      fatherFullName: '',
                                      fatherBornDate: '',
                                      fatherBornState: '',
                                      fatherBornCounty: '',
                                      fatherBornCountry: '',
                                      motherFullName: '',
                                      motherBornDate: '',
                                      motherBornState: '',
                                      motherBornCounty: '',
                                      motherForeignCountry: '',
                                      fatherForeignCountry: '',
                                      motherBornCountry: '',
                                      childrenOrder: ''
                                    }));
                                  }}
                                >
                                  <option value="" label="Select progeny Count" />
                                  {Array(10).fill(0).map((item: any, index: number) => (
                                    <option key={index} value={index + 1}>
                                      {index + 1}
                                    </option>
                                  ))}

                                </Field>
                                <ErrorMessage
                                  name="progenyCount"
                                  component="div"
                                  className="error-message"
                                />
                              </div>
                            </div>


                            <FieldArray name="childList">
                              {({insert, remove}) =>
                                values?.childList?.length > 0 ? (
                                  <>
                                    {values.childList.map((child: any, index: number) => (
                                      <div key={index} className="childListArray">
                                        <span className="details">
                                          <b>{index + 1}. Progeny Below Regardless of Age</b>
                                        </span>
                                        <div></div>
                                        <div>
                                          <span className="details">Progeny’s Full Name</span>
                                          <Field
                                            type="text"
                                            name={`childList[${index}].childrenFullName`}
                                            placeholder="Progeny’s Full Name"
                                          />
                                          <ErrorMessage
                                            name={`childList[${index}].childrenFullName`}
                                            component="div"
                                            className="error-message"
                                          />
                                        </div>
                                        <div>
                                          <span className="details">Progeny’s Born Day and Time, if known</span>
                                          <Field
                                            type="datetime-local"
                                            name={`childList[${index}].childrenBornDayTime`}
                                            placeholder="Progeny’s Born Day and Time, if known"
                                          />
                                          <ErrorMessage
                                            name={`childList[${index}].childrenBornDayTime`}
                                            component="div"
                                            className="error-message"
                                          />
                                        </div>
                                        <div className="details">
                                          <span className="gender-title">Gender</span>
                                          <div className="category">
                                            <label htmlFor={`dot-1-${index}`}>
                                              <Field
                                                type="radio"
                                                id={`dot-1-${index}`}
                                                name={`childList[${index}].childrenGender`}
                                                value="Male"
                                              />
                                              <span className="dot one"></span>
                                              <span className="gender">Male</span>
                                            </label>
                                            &nbsp;
                                            <label htmlFor={`dot-2-${index}`}>
                                              <Field
                                                type="radio"
                                                id={`dot-2-${index}`}
                                                name={`childList[${index}].childrenGender`}
                                                value="Female"
                                              />
                                              <span className="dot two"></span>
                                              <span className="gender">Female</span>
                                            </label>
                                          </div>
                                          <ErrorMessage
                                            name={`childList[${index}].childrenGender`}
                                            component="div"
                                            className="error-message"
                                          />
                                        </div>
                                        <div>
                                          <span className="details">Progeny’s State of Birth</span>
                                          <Field
                                            as="select"
                                            name={`childList[${index}].childrenStateOfBirth`}
                                            className="form-select"
                                          >
                                            <option value="" label="Select a state" />
                                            {Object.entries(stateJson).map(([abbreviation, name]) => (
                                              <option key={name} value={name}>
                                                {name}
                                              </option>
                                            ))}
                                          </Field>
                                          <ErrorMessage
                                            name={`childList[${index}].childrenStateOfBirth`}
                                            component="div"
                                            className="error-message"
                                          />
                                        </div>
                                        <div>
                                          <span className="details">Progeny’s County of Birth</span>
                                          <Field
                                            type="text"
                                            name={`childList[${index}].childrenCountyOfBirth`}
                                            placeholder="Progeny’s County of Birth"
                                          />
                                          <ErrorMessage
                                            name={`childList[${index}].childrenCountyOfBirth`}
                                            component="div"
                                            className="error-message"
                                          />
                                        </div>
                                        <div className="arrayInnerfield">
                                          <span className="details">Father’s Full Name</span>
                                          <Field
                                            type="text"
                                            name={`childList[${index}].fatherFullName`}
                                            placeholder="Enter father’s full name"
                                          />
                                          <ErrorMessage
                                            name={`childList[${index}].fatherFullName`}
                                            component="div"
                                            className="error-message"
                                          />
                                        </div>
                                        <div className="arrayInnerfield">
                                          <span className="details">Father’s Born Date</span>
                                          <Field
                                            type="date"
                                            name={`childList[${index}].fatherBornDate`}
                                            placeholder="Enter father’s born date"
                                          />
                                          <ErrorMessage
                                            name={`childList[${index}].fatherBornDate`}
                                            component="div"
                                            className="error-message"
                                          />
                                        </div>
                                        <div className="details"></div>
                                        <div className="details">
                                          <span className="country-title">Father Born in foreign country?</span>
                                          <div className="category">
                                            <label htmlFor={`father-yes-${index}`}>
                                              <Field
                                                type="radio"
                                                id={`father-yes-${index}`}
                                                name={`childList[${index}].fatherForeignCountry`}
                                                value="yes"
                                              />
                                              <span className="dot one"></span>
                                              <span className="fatherForeignCountry">yes</span>
                                            </label>
                                            &nbsp;
                                            <label htmlFor={`father-no-${index}`}>
                                              <Field
                                                type="radio"
                                                id={`father-no-${index}`}
                                                name={`childList[${index}].fatherForeignCountry`}
                                                value="no"
                                              />
                                              <span className="dot two"></span>
                                              <span className="fatherForeignCountry">no</span>
                                            </label>
                                          </div>
                                          <ErrorMessage
                                            name={`childList[${index}].fatherForeignCountry`}
                                            component="div"
                                            className="error-message"
                                          />
                                        </div>
                                        {values.childList[index].fatherForeignCountry == "no" ? <>
                                          <div className="arrayInnerfield">
                                            <span className="details">Father’s Born State</span>
                                            <Field
                                              as="select"
                                              name={`childList[${index}].fatherBornState`}
                                              className="form-select"
                                            >
                                              <option value="" label="Select a state" />
                                              {Object.entries(stateJson).map(([abbreviation, name]) => (
                                                <option key={name} value={name}>
                                                  {name}
                                                </option>
                                              ))}
                                            </Field>
                                            <ErrorMessage
                                              name={`childList[${index}].fatherBornState`}
                                              component="div"
                                              className="error-message"
                                            />
                                          </div>
                                          <div className="arrayInnerfield">
                                            <span className="details">Father’s Born County</span>
                                            <Field
                                              type="text"
                                              name={`childList[${index}].fatherBornCounty`}
                                              placeholder="Enter father’s born County"
                                            />
                                            <ErrorMessage
                                              name={`childList[${index}].fatherBornCounty`}
                                              component="div"
                                              className="error-message"
                                            />
                                          </div>
                                        </> : <>
                                          <div className="arrayInnerfield">
                                            <span className="details">Father’s Born Country?</span>
                                            <Field
                                              type="text"
                                              name={`childList[${index}].fatherBornCountry`}
                                              placeholder="Father’s Born Country"
                                            />
                                            <ErrorMessage
                                              name={`childList[${index}].fatherBornCountry`}
                                              component="div"
                                              className="error-message"
                                            />
                                          </div>
                                        </>}
                                        <div className="arrayInnerfield">
                                          <span className="details">Mother’s Full Name</span>
                                          <Field
                                            type="text"
                                            name={`childList[${index}].motherFullName`}
                                            placeholder="Enter mother’s full name"
                                          />
                                          <ErrorMessage
                                            name={`childList[${index}].motherFullName`}
                                            component="div"
                                            className="error-message"
                                          />
                                        </div>
                                        <div className="arrayInnerfield">
                                          <span className="details">Mother’s Born Date</span>
                                          <Field
                                            type="date"
                                            name={`childList[${index}].motherBornDate`}
                                            placeholder="Enter mother’s born date"
                                          />
                                          <ErrorMessage
                                            name={`childList[${index}].motherBornDate`}
                                            component="div"
                                            className="error-message"
                                          />
                                        </div>
                                        {values.childList[index].fatherForeignCountry == "no" && <div className="details"></div>}
                                        <div className="details">
                                          <span className="country-title">Mother Born in foreign country?</span>
                                          <div className="category">
                                            <label htmlFor={`mother-yes-${index}`}>
                                              <Field
                                                type="radio"
                                                id={`mother-yes-${index}`}
                                                name={`childList[${index}].motherForeignCountry`}
                                                value="yes"
                                              />
                                              <span className="dot one"></span>
                                              <span className="motherForeignCountry">yes</span>
                                            </label>
                                            &nbsp;
                                            <label htmlFor={`mother-no-${index}`}>
                                              <Field
                                                type="radio"
                                                id={`mother-no-${index}`}
                                                name={`childList[${index}].motherForeignCountry`}
                                                value="no"
                                              />
                                              <span className="dot two"></span>
                                              <span className="motherForeignCountry">no</span>
                                            </label>
                                          </div>
                                          <ErrorMessage
                                            name={`childList[${index}].motherForeignCountry`}
                                            component="div"
                                            className="error-message"
                                          />
                                        </div>
                                        {values.childList[index].motherForeignCountry == "no" ? <>
                                          <div className="arrayInnerfield">
                                            <span className="details">Mother’s Born State</span>
                                            <Field
                                              as="select"
                                              name={`childList[${index}].motherBornState`}
                                              className="form-select"
                                            >
                                              <option value="" label="Select a state" />
                                              {Object.entries(stateJson).map(([abbreviation, name]) => (
                                                <option key={name} value={name}>
                                                  {name}
                                                </option>
                                              ))}
                                            </Field>
                                            <ErrorMessage
                                              name={`childList[${index}].motherBornState`}
                                              component="div"
                                              className="error-message"
                                            />
                                          </div>
                                          <div className="arrayInnerfield">
                                            <span className="details">Mother’s Born County</span>
                                            <Field
                                              type="text"
                                              name={`childList[${index}].motherBornCounty`}
                                              placeholder="Enter mother’s born County"
                                            />
                                            <ErrorMessage
                                              name={`childList[${index}].motherBornCounty`}
                                              component="div"
                                              className="error-message"
                                            />
                                          </div>
                                        </> : <>
                                          <div className="arrayInnerfield">
                                            <span className="details">Mother’s Born Country?</span>
                                            <Field
                                              type="text"
                                              name={`childList[${index}].motherBornCountry`}
                                              placeholder="Father’s Born Country"
                                            />
                                            <ErrorMessage
                                              name={`childList[${index}].motherBornCountry`}
                                              component="div"
                                              className="error-message"
                                            />
                                          </div>
                                        </>}
                                        <div>
                                          <span className="details">Order of Child (first, second, etc)</span>
                                          <Field
                                            as="select"
                                            name={`childList[${index}].childrenOrder`}
                                            className="form-select"
                                          >
                                            <option value="" label="Select Order" />
                                            {ordinalOrderArray.map((item: string, index: number) => (
                                              <option key={index} value={item}>
                                                {item}
                                              </option>
                                            ))}
                                          </Field>
                                          <ErrorMessage
                                            name={`childList[${index}].childrenOrder`}
                                            component="div"
                                            className="error-message"
                                          />
                                        </div>
                                        <div className="input-box">
                                          <span className="details">Mailing Address</span>
                                          <Field
                                            as="textarea"
                                            rows={5}
                                            name={`childList[${index}].mailingAddress`}
                                            placeholder="Mailing address"
                                          />
                                          <ErrorMessage
                                            name={`childList[${index}].mailingAddress`}
                                            component="div"
                                            className="error-message"
                                          />
                                        </div>
                                      </div>
                                    ))}
                                  </>
                                ) : (
                                  <div className="input-box">
                                  </div>
                                )
                              }
                            </FieldArray>

                          </>
                        }

                        <div className="input-box">
                          <span className="detailsdark">
                            Lookup Local Post Office Information.
                          </span>
                          <p style={{margin: "15px 0"}}>
                            Use this free website to search for parent information if unknown. Email address is required to create a free account. <br />
                            Below you will need too Lookup your 9-digit zip code: <br /><br />
                            <a href="https://tools.usps.com/zip-code-lookup.htm?byaddress" target="_blank">https://tools.usps.com/zip-code-lookup.htm?byaddress</a> <br /><br />
                            Lookup your local U.S. Post office using your 9-digit zip code (your local Post Office should be the first one on the list): <br /><br />
                            <a href="https://tools.usps.com/find-location.htm" target="_blank">https://tools.usps.com/find-location.htm</a>
                          </p>
                          <span className="details">
                            Street Address of your local U.S. Post Office
                          </span>
                          <Field type="text" name="postStreetAddress" placeholder="Street Address of your local U.S. Post Office" />
                          <ErrorMessage
                            name="postStreetAddress"
                            component="div"
                            className="error-message"
                          />
                        </div>

                        <div className="input-box">
                          <span className="details">
                            City of your local U.S. Post Office
                          </span>

                          <Field type="text" name="postcity" placeholder="City of your local U.S. Post Office" />
                          <ErrorMessage
                            name="postcity"
                            component="div"
                            className="error-message"
                          />
                        </div>

                        <div className="input-box">
                          <span className="details">
                            Zip Code of your local U.S. Post Office
                          </span>


                          <Field type="text" name="postzipCode" placeholder="Zip Code of your local U.S. Post Office" />
                          <ErrorMessage
                            name="postzipCode"
                            component="div"
                            className="error-message"
                          />
                        </div>





                        <div className="input-box"> </div>
                        <div className="input-box">
                          <div>
                            <span className="details">
                              How would you like to record your documents?
                            </span>
                            <Field
                              as="select"
                              name="recordDocuments"
                              className="form-select"
                            >
                              <option value="" label="Select record documents type" />
                              <option value="Notary" label="Notary" />
                              <option value="SRS" label="Bucolic Living Law"/>
                            </Field>
                            <ErrorMessage
                              name="recordDocuments"
                              component="div"
                              className="error-message"
                            />
                          </div>
                        </div>


                      </>
                    )}
                  </div>
                  <div className="button-group">
                    {currentStep > 1 && (
                      <button
                        type="button"
                        onClick={prevStep}
                        className="previous"
                        disabled={loading}
                      >
                        Previous
                      </button>
                    )}
                    {currentStep < totalSteps && (
                      <button
                        type="button"
                        className="next"
                        onClick={() => handleNext(validateForm, setTouched)}
                        disabled={loading}
                      >
                        Next
                      </button>
                    )}
                    {currentStep === totalSteps && (
                      <button
                        type="submit"
                        className="submit"
                        disabled={loading}
                        onClick={() => {
                          console.log(errors)
                          validtionFormf()
                          async function validtionFormf() {
                            await validateForm()
                          }
                        }}
                      >
                        {loading ? "Generating PDF..." : "Submit"}
                      </button>
                    )}
                  </div>
                </Form>
              )
            }}
          </Formik>
        </div>
      </div>

    </>
  );
}
