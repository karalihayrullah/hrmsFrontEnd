import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { useSelector } from "react-redux";
import { Formik, useFormik } from "formik";
import * as Yup from "yup";
import Headline from "./../layouts/Headline";
import JobPostingService from "../services/jobPostingService";
import JobTitleService from "../services/jobTitleService";
import CityService from "../services/cityService";
import WorkingTimeService from "../services/workingTimeService";
import WorkingTypeService from "../services/workingTypeService";
import DateLabel from "./../layouts/DateLabel"; 
import { Container, Grid, Label, Form, Button } from "semantic-ui-react";


export default function JobPostingAdd() {
  let { id } = useParams();

  const { authItem } = useSelector(state => state.auth)

  const [jobTitles, setJobTitles] = useState([]);
  const [cities, setCities] = useState([]);
  const [workingTimes, setWorkingTimes] = useState([]);
  const [workingTypes, setWorkingTypes] = useState([]);
  const [open, setOpen] = useState(false);

  let jobPostingService = new JobPostingService();
  let jobTitleService = new JobTitleService();
  let cityService = new CityService();
  let workingTimeService = new WorkingTimeService();
  let workingTypeService = new WorkingTypeService();

  useEffect(() => {
    jobTitleService.getAll().then((result) => setJobTitles(result.data.data));
    cityService.getAll().then((result) => setCities(result.data.data));
    workingTimeService.getAll().then((result) => setWorkingTimes(result.data.data));
    workingTypeService.getAll().then((result) => setWorkingTypes(result.data.data));
  }, []);

  const jobTitleOptions = jobTitles.map((jobTitle) => ({
    key: jobTitle.id,
    text: jobTitle.title,
    value: jobTitle,
  }));

  const cityOptions = cities.map((city) => ({
    key: city.id,
    text: city.city,
    value: city,
  }));

  const workingTimeOptions = workingTimes.map((workingTime) => ({
    key: workingTime.id,
    text: workingTime.time,
    value: workingTime,
  }));

  const workingTypeOptions = workingTypes.map((workingType) => ({
    key: workingType.id,
    text: workingType.type,
    value: workingType,
  }));

  const initialValues = {
    employer: { id: id },
    jobTitle: "",
    city: "",
    workingTime: "",
    workingType: "",
    jobDescription: "",
    numberOfOpenPositions: "",
    salaryMin: "",
    salaryMax: "",
    closingDate: "",
  };

  const validationSchema = Yup.object({
    jobTitle: Yup.object().required("Bo?? B??rak??lamaz"),
    city: Yup.object().required("Bo?? B??rak??lamaz"),
    workingTime: Yup.object().required("Bo?? B??rak??lamaz"),
    workingType: Yup.object().required("Bo?? B??rak??lamaz"),
    jobDescription: Yup.string().max(2300, "Over 1150 Characters").required("Bo?? B??rak??lamaz"),
    numberOfOpenPositions: Yup.number().positive("Pozitif Say?? Giriniz").required("Bo?? B??rak??lamaz"),
    salaryMin: Yup.string(),
    salaryMax: Yup.string(),
    closingDate: Yup.date().required("Bo?? B??rak??lamaz"),
  });

  const onSubmit = (values, { resetForm }) => {
    console.log(values);
    jobPostingService.add(values);
    handleModal(true);
    setTimeout(() => {
      resetForm();
    }, 100);
  };

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,
    onSubmit: onSubmit,
  });

  const handleModal = (value) => {
    setOpen(value);
  };

  const handleChange = (fieldName, value) => {
    formik.setFieldValue(fieldName, value);
  };

  return (
    <div>

      {authItem[0].user.userType !== 2 &&
      
        <div className="ui negative message">
          <div className="header">
            Bu sayfay?? g??r??nt??lemeye yetkiniz yok
          </div>
          <p>Giri?? yapmay?? yada bir i?? veren hesab?? olu??turmay?? deneyebilirsiniz</p>
        </div>

      
      }
      {authItem[0].user.userType === 2 &&
        <Container className="content">
          <Headline content="Is Ilani Ekle" />

          <Grid>
            <Grid.Row>
              <Grid.Column width="3" />
              <Grid.Column width="10">
                <DateLabel value={new Date().toDateString()} />

                <Formik>
                  <Form onSubmit={formik.handleSubmit}>
                    <Form.Select
                      name="jobTitle"
                      label="??nvan"
                      options={jobTitleOptions}
                      onChange={(event, data) => handleChange("jobTitle", data.value)}
                      value={formik.values.jobTitle}
                    />
                    {formik.errors.jobTitle && formik.touched.jobTitle && <span><Label basic pointing color="pink" className="orbitron" content={formik.errors.jobTitle} /><br /><br /></span>}
                    <Form.Select
                      name="city"
                      label="City"
                      options={cityOptions}
                      onChange={(event, data) => handleChange("city", data.value)}
                      value={formik.values.city}
                    />
                    {formik.errors.city && formik.touched.city && <span><Label basic pointing color="pink" className="orbitron" content={formik.errors.city} /><br /><br /></span>}
                    <Form.Group widths="equal">
                      <Form.Select
                        name="workingTime"
                        label="??al????ma Zaman??"
                        options={workingTimeOptions}
                        onChange={(event, data) => handleChange("workingTime", data.value)}
                        value={formik.values.workingTime}
                      />
                      <Form.Select
                        name="workingType"
                        label="??al????ma ??ekli"
                        options={workingTypeOptions}
                        onChange={(event, data) => handleChange("workingType", data.value)}
                        value={formik.values.workingType}
                      />
                    </Form.Group>
                    <Grid>
                      <Grid.Row columns="equal">
                        <Grid.Column>
                          {formik.errors.workingTime && formik.touched.workingTime && <span><Label basic pointing color="pink" className="orbitron" content={formik.errors.workingTime} /><br /><br /></span>}
                        </Grid.Column>
                        <Grid.Column>
                          {formik.errors.workingType && formik.touched.workingType && <span><Label basic pointing color="pink" className="orbitron" content={formik.errors.workingType} /><br /><br /></span>}
                        </Grid.Column>
                      </Grid.Row>
                    </Grid>
                    <Form.TextArea
                      name="jobDescription"
                      label="A????klama"
                      placeholder=". . ."
                      onChange={(event, data) => handleChange("jobDescription", data.value)}
                      value={formik.values.jobDescription}
                    />
                    {formik.errors.jobDescription && formik.touched.jobDescription && <span><Label basic pointing color="pink" className="orbitron" content={formik.errors.jobDescription} /><br /><br /></span>}
                    <Form.Group widths="equal">
                      <Form.Input
                        name="numberOfOpenPositions"
                        label="A????k Pozisyon Say??s??"
                        placeholder="1"
                        onChange={(event, data) => handleChange("numberOfOpenPositions", data.value)}
                        value={formik.values.numberOfOpenPositions}
                      />
                      <Form.Input
                        name="closingDate"
                        label="Kapan???? Tarihi"
                        placeholder="YYYY-MM-DD"
                        onChange={(event, data) => handleChange("closingDate", data.value)}
                        value={formik.values.closingDate}
                      />
                    </Form.Group>
                    <Grid>
                      <Grid.Row columns="equal">
                        <Grid.Column>
                          {formik.errors.numberOfOpenPositions && formik.touched.numberOfOpenPositions && <span><Label basic pointing color="pink" className="orbitron" content={formik.errors.numberOfOpenPositions} /><br /><br /></span>}
                        </Grid.Column>
                        <Grid.Column>
                          {formik.errors.closingDate && formik.touched.closingDate && <span><Label basic pointing color="pink" className="orbitron" content={formik.errors.closingDate} /><br /><br /></span>}
                        </Grid.Column>
                      </Grid.Row>
                    </Grid>
                    <Form.Group widths="equal">
                      <Form.Input
                        name="salaryMin"
                        label="Maa?? Min(Tercihen)"
                        placeholder="5000 ???"
                        onChange={(event, data) => handleChange("salaryMin", data.value)}
                        value={formik.values.salaryMin}
                      />
                      <Form.Input
                        name="salaryMax"
                        label="Maa?? Max(Tercihen)"
                        placeholder="10000 ???"
                        onChange={(event, data) => handleChange("salaryMax", data.value)}
                        value={formik.values.salaryMax}
                      />
                    </Form.Group>
                    <Grid>
                      <Grid.Row columns="equal">
                        <Grid.Column>
                          {formik.errors.salaryMin && formik.touched.salaryMin && <span><Label basic pointing color="pink" className="orbitron" content={formik.errors.salaryMin} /><br /></span>}
                        </Grid.Column>
                        <Grid.Column>
                          {formik.errors.salaryMax && formik.touched.salaryMax && <span><Label basic pointing color="pink" className="orbitron" content={formik.errors.salaryMax} /><br /></span>}
                        </Grid.Column>
                      </Grid.Row>
                    </Grid>
                    <br />

                    <Button circular fluid type="submit" color="yellow" content="Yay??nla" />
                  </Form>
                </Formik>
              </Grid.Column>
              <Grid.Column width="3" />
            </Grid.Row>
          </Grid>

        </Container>
      }
    </div>
  );
}